import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  initialFinance,
  initialHabits,
  initialHealth,
  initialMeals,
  initialMood,
  initialNotifications,
  initialOrders,
  initialProducts,
  initialProfile,
  initialTasks,
  initialVendors,
  initialWorkouts,
} from '../data/mockAiosData';
import type {
  AssistantAction,
  AssistantActionResult,
  AssistantReply,
  AppBootstrap,
  AppNotification,
  BudgetCategory,
  CartItem,
  CheckoutResult,
  FinanceSnapshot,
  Habit,
  HealthSnapshot,
  MealPlanItem,
  Mood,
  Order,
  OrderItem,
  PaymentMethod,
  PaymentRecord,
  Product,
  RoutineSection,
  RoutineTask,
  UserProfile,
  Vendor,
  Workout,
  DashboardInsight,
} from '../types/aios';
import {
  checkoutApi,
  fetchBootstrap,
  fetchPaymentsHistory,
  queryAssistantApi,
  syncApiMutation,
} from '../lib/api';
import { useAuth } from './AuthContext';

type DetailedCartItem = {
  product: Product;
  vendor: Vendor;
  quantity: number;
  total: number;
};

type DetailedOrder = Order & {
  products: Array<{
    product: Product;
    quantity: number;
    unitPrice: number;
  }>;
  progressPct: number;
};

type QuickProduct = {
  product: Product;
  vendor: Vendor;
};

type AiosAppContextValue = {
  profile: UserProfile;
  mood: Mood;
  setMood: (mood: Mood) => void;
  todayLabel: string;
  vendors: Vendor[];
  products: Product[];
  quickProducts: QuickProduct[];
  tasks: RoutineTask[];
  tasksBySection: Record<RoutineSection, RoutineTask[]>;
  habits: Habit[];
  workouts: Workout[];
  meals: MealPlanItem[];
  health: HealthSnapshot;
  finance: FinanceSnapshot;
  notifications: AppNotification[];
  unreadNotifications: number;
  cartItems: DetailedCartItem[];
  cartCount: number;
  cartSubtotal: number;
  activeOrder: DetailedOrder | null;
  recentOrders: DetailedOrder[];
  healthScore: number;
  productivityScore: number;
  completedTaskCount: number;
  totalTaskCount: number;
  caloriesConsumed: number;
  monthlyIncomeTotal: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  financeInsight: string;
  dashboardInsights: DashboardInsight[];
  paymentHistory: PaymentRecord[];
  addCartItem: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  placeCartOrder: () => DetailedOrder | null;
  placeProductOrder: (productId: string) => DetailedOrder | null;
  checkoutCart: (paymentMethod: PaymentMethod) => Promise<CheckoutResult | null>;
  toggleTask: (taskId: string) => void;
  addTask: (section: RoutineSection, title: string) => void;
  toggleHabit: (habitId: string) => void;
  logWater: (amount?: number) => void;
  toggleWorkout: (workoutId: string) => void;
  completeMeal: (mealId: string) => void;
  askAssistant: (query: string) => AssistantReply;
  queryAssistant: (query: string) => Promise<AssistantReply>;
  executeAssistantAction: (action: AssistantAction) => AssistantActionResult;
};

const AiosAppContext = createContext<AiosAppContextValue | null>(null);

const statusProgress: Record<Order['status'], number> = {
  preparing: 25,
  picked_up: 55,
  delivering: 78,
  delivered: 100,
};

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCategoryIdForProduct(product: Product) {
  if (product.category === 'food') {
    return 'food';
  }
  if (product.category === 'groceries') {
    return 'groceries';
  }
  if (product.category === 'pharmacy') {
    return 'health';
  }
  return 'shopping';
}

function getCategoryLabel(categories: BudgetCategory[], categoryId: string) {
  const match = categories.find((item) => item.id === categoryId);
  return match ? match.name : 'Shopping';
}

function parseBudget(query: string) {
  const match = query.match(/\$?\s?(\d{1,3})(?:\.\d{1,2})?/);
  return match ? Number(match[1]) : null;
}

function buildDetailedOrder(order: Order, products: Product[]) {
  return {
    ...order,
    products: order.items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) {
          return null;
        }
        return {
          product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    progressPct: statusProgress[order.status],
  };
}

export function AiosAppProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [mood, setMoodState] = useState(initialMood);
  const [vendors, setVendors] = useState(initialVendors);
  const [products, setProducts] = useState(initialProducts);
  const [tasks, setTasks] = useState(initialTasks);
  const [habits, setHabits] = useState(initialHabits);
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [meals, setMeals] = useState(initialMeals);
  const [health, setHealth] = useState(initialHealth);
  const [finance, setFinance] = useState(initialFinance);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [orders, setOrders] = useState(initialOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  const resetLocalState = () => {
    setProfile(initialProfile);
    setMoodState(initialMood);
    setVendors(initialVendors);
    setProducts(initialProducts);
    setTasks(initialTasks);
    setHabits(initialHabits);
    setWorkouts(initialWorkouts);
    setMeals(initialMeals);
    setHealth(initialHealth);
    setFinance(initialFinance);
    setNotifications(initialNotifications);
    setOrders(initialOrders);
    setCart([]);
    setPaymentHistory([]);
  };

  const applyBootstrap = (bootstrap: AppBootstrap) => {
    setProfile(bootstrap.profile);
    setMoodState(bootstrap.mood);
    setVendors(bootstrap.vendors);
    setProducts(bootstrap.products);
    setTasks(bootstrap.tasks);
    setHabits(bootstrap.habits);
    setWorkouts(bootstrap.workouts);
    setMeals(bootstrap.meals);
    setHealth(bootstrap.health);
    setFinance(bootstrap.finance);
    setNotifications(bootstrap.notifications);
    setOrders(bootstrap.orders);
    setCart(bootstrap.cart);
  };

  const mutateApi = async (path: string, init?: RequestInit) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      await syncApiMutation(path, init);
    } catch {
      // Keep the app usable offline or without the local API running.
    }
  };

  useEffect(() => {
    let active = true;

    void (async () => {
      if (!isAuthenticated) {
        if (active) {
          resetLocalState();
        }
        return;
      }

      try {
        const [bootstrap, payments] = await Promise.all([
          fetchBootstrap(),
          fetchPaymentsHistory().catch(() => []),
        ]);
        if (active) {
          applyBootstrap(bootstrap);
          setPaymentHistory(payments);
        }
      } catch {
        // Frontend fallback data stays active when the backend is unavailable.
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const todayLabel = getTodayLabel();
  const tasksBySection: Record<RoutineSection, RoutineTask[]> = {
    morning: tasks.filter((task) => task.section === 'morning'),
    afternoon: tasks.filter((task) => task.section === 'afternoon'),
    evening: tasks.filter((task) => task.section === 'evening'),
  };
  const completedTaskCount = tasks.filter((task) => task.completed).length;
  const totalTaskCount = tasks.length;
  const completedHabitCount = habits.filter((habit) => habit.completedDays[6]).length;
  const productivityScore = Math.round(
    ((completedTaskCount / Math.max(totalTaskCount, 1)) * 0.75 +
      (completedHabitCount / Math.max(habits.length, 1)) * 0.25) *
      100,
  );
  const caloriesConsumed = meals
    .filter((meal) => meal.completed)
    .reduce((sum, meal) => sum + meal.calories, 0);
  const healthScore = Math.round(
    (Math.min(health.stepsToday / health.stepGoal, 1) * 30 +
      Math.min(health.waterGlasses / health.waterGoal, 1) * 20 +
      Math.min(health.sleepHours / health.sleepGoal, 1) * 25 +
      (productivityScore / 100) * 25) *
      100,
  ) / 100;
  const unreadNotifications = notifications.filter((item) => item.unread).length;

  const cartItems: DetailedCartItem[] = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        return null;
      }
      const vendor = vendors.find((entry) => entry.id === product.vendorId);
      if (!vendor) {
        return null;
      }
      return {
        product,
        vendor,
        quantity: item.quantity,
        total: item.quantity * product.price,
      };
    })
    .filter((item): item is DetailedCartItem => Boolean(item));

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const recentOrders = orders.map((order) => buildDetailedOrder(order, products));
  const activeOrder =
    recentOrders.find((order) => order.status !== 'delivered') ?? null;

  const quickProducts: QuickProduct[] = products
    .filter((product) => product.category === 'food' && product.featured)
    .slice(0, 4)
    .map((product) => {
      const vendor = vendors.find((entry) => entry.id === product.vendorId);
      if (!vendor) {
        return null;
      }
      return { product, vendor };
    })
    .filter((item): item is QuickProduct => Boolean(item));

  const monthlyIncomeTotal = finance.monthlyIncome + finance.extraIncome;
  const totalExpenses = finance.categories.reduce(
    (sum, category) => sum + category.spent,
    0,
  );
  const savings = monthlyIncomeTotal - totalExpenses;
  const savingsRate = Math.round((savings / Math.max(monthlyIncomeTotal, 1)) * 100);
  const foodBudget = finance.categories.find((category) => category.id === 'food');
  const financeInsight = foodBudget && foodBudget.spent > foodBudget.budget
    ? `Food spend is $${(foodBudget.spent - foodBudget.budget).toFixed(
        0,
      )} over budget. Ordering one more healthy lunch from Green Kitchen still keeps the damage smaller than another late-night pizza run.`
    : `Your spending is balanced this month. Keep using the assistant for budget-aware suggestions to protect your savings rate.`;

  const dashboardInsights: DashboardInsight[] = [
    {
      id: 'insight-water',
      icon: 'Water',
      text:
        health.waterGlasses >= health.waterGoal
          ? 'Hydration goal reached. Keep the momentum through the evening.'
          : `You are ${health.waterGoal - health.waterGlasses} glasses behind on water. One tap logs the next glass.`,
      actionLabel: health.waterGlasses >= health.waterGoal ? 'Open Health' : 'Log Water',
      action:
        health.waterGlasses >= health.waterGoal
          ? { type: 'open_route', route: '/health', label: 'Open Health' }
          : { type: 'log_water', label: 'Log Water' },
    },
    {
      id: 'insight-order',
      icon: 'Delivery',
      text: activeOrder
        ? `${activeOrder.vendorName} is ${activeOrder.etaLabel.toLowerCase()} away.`
        : 'No live order right now. The assistant can place dinner in one step.',
      actionLabel: activeOrder ? 'Track Order' : 'Browse Food',
      action: activeOrder
        ? { type: 'open_route', route: '/marketplace', label: 'Track Order' }
        : { type: 'open_route', route: '/marketplace', label: 'Browse Food' },
    },
    {
      id: 'insight-focus',
      icon: 'Routine',
      text:
        mood === 'tired'
          ? 'You marked yourself tired. A lighter workout and a simpler evening plan make sense.'
          : 'Your next unfinished task is ready. Closing one more task would push productivity above 70%.',
      actionLabel: 'Open Routine',
      action: { type: 'open_route', route: '/routine', label: 'Open Routine' },
    },
  ];

  const setMood = (nextMood: Mood) => {
    setMoodState(nextMood);
    void mutateApi('/mood', {
      method: 'POST',
      body: JSON.stringify({ mood: nextMood }),
    });
  };

  const addNotification = (notification: AppNotification) => {
    setNotifications((current) => [notification, ...current.slice(0, 5)]);
  };

  const addCartItem = (productId: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId, quantity: 1 }];
    });
    void mutateApi('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, delta: 1 }),
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
    void mutateApi(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ delta }),
    });
  };

  const clearCart = () => {
    setCart([]);
    void mutateApi('/cart', {
      method: 'DELETE',
    });
  };

  const commitOrder = (items: OrderItem[], vendorName: string, vendorId: string) => {
    const itemProducts = items
      .map((item) => products.find((product) => product.id === item.productId))
      .filter((item): item is Product => Boolean(item));
    if (!itemProducts.length) {
      return null;
    }

    const uniqueVendorIds = Array.from(
      new Set(itemProducts.map((product) => product.vendorId)),
    );
    const primaryVendor =
      vendors.find((vendor) => vendor.id === uniqueVendorIds[0]) ?? null;
    const etaMinutes = uniqueVendorIds.length === 1
      ? primaryVendor?.etaMinutes ?? 30
      : Math.max(
          ...itemProducts.map((product) => {
            const vendor = vendors.find((entry) => entry.id === product.vendorId);
            return vendor?.etaMinutes ?? 35;
          }),
        );
    const deliveryFee = uniqueVendorIds.length === 1 ? primaryVendor?.deliveryFee ?? 0 : 3.99;
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order: Order = {
      id: `order-${Date.now()}`,
      vendorId,
      vendorName,
      status: 'preparing',
      createdAtLabel: 'Just now',
      etaMinutes,
      etaLabel: `${etaMinutes} min`,
      subtotal,
      deliveryFee,
      items,
    };

    setOrders((current) => [order, ...current]);

    const categoryId =
      uniqueVendorIds.length === 1
        ? getCategoryIdForProduct(itemProducts[0])
        : 'shopping';
    const categoryLabel = getCategoryLabel(finance.categories, categoryId);
    const orderTotal = subtotal + deliveryFee;

    setFinance((current) => ({
      ...current,
      monthlySeries: current.monthlySeries.map((point, index) =>
        index === current.monthlySeries.length - 1
          ? { ...point, expenses: point.expenses + orderTotal }
          : point,
      ),
      categories: current.categories.map((category) =>
        category.id === categoryId
          ? { ...category, spent: category.spent + orderTotal }
          : category,
      ),
      transactions: [
        {
          id: `txn-${Date.now()}`,
          name: vendorName,
          categoryId,
          categoryLabel,
          amount: -orderTotal,
          dateLabel: 'Just now',
          emoji: vendorName.charAt(0).toUpperCase(),
          type: 'expense',
        },
        ...current.transactions,
      ],
    }));

    const hasFood = itemProducts.some((product) => product.category === 'food');
    if (hasFood) {
      const totalCalories = itemProducts.reduce(
        (sum, product, index) => sum + (product.calories ?? 0) * items[index].quantity,
        0,
      );
      const mealName = new Date().getHours() >= 15 ? 'Dinner' : 'Lunch';
      setMeals((current) => [
        {
          id: `meal-${Date.now()}`,
          meal: mealName,
          timeLabel: 'Tonight',
          items: `${vendorName} order`,
          calories: totalCalories || 540,
          completed: false,
          source: 'order',
        },
        ...current,
      ]);
    }

    addNotification({
      id: `notification-order-${Date.now()}`,
      kind: 'order',
      title: `Order placed with ${vendorName}`,
      body: `Estimated arrival in ${etaMinutes} minutes.`,
      timeLabel: 'Just now',
      unread: true,
    });

    return buildDetailedOrder(order, products);
  };

  const placeCartOrder = () => {
    if (!cartItems.length) {
      return null;
    }
    const orderItems = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }));
    const uniqueVendors = Array.from(
      new Set(cartItems.map((item) => item.vendor.id)),
    );
    const vendorName =
      uniqueVendors.length === 1
        ? cartItems[0].vendor.name
        : 'AIOS Local Bundle';
    const vendorId =
      uniqueVendors.length === 1 ? cartItems[0].vendor.id : 'bundle';

    const order = commitOrder(
      orderItems,
      vendorName,
      vendorId,
    );

    if (order) {
      setCart([]);
      void mutateApi('/orders', {
        method: 'POST',
        body: JSON.stringify({ items: orderItems }),
      });
    }

    return order;
  };

  const placeProductOrder = (productId: string) => {
    const product = products.find((entry) => entry.id === productId);
    if (!product) {
      return null;
    }
    const vendor = vendors.find((entry) => entry.id === product.vendorId);
    if (!vendor) {
      return null;
    }
    const order = commitOrder(
      [{ productId, quantity: 1, unitPrice: product.price }],
      vendor.name,
      vendor.id,
    );
    if (order) {
      void mutateApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId, quantity: 1, unitPrice: product.price }],
        }),
      });
    }
    return order;
  };

  const checkoutCart = async (paymentMethod: PaymentMethod) => {
    if (!cartItems.length) {
      return null;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }));

    try {
      const result = await checkoutApi(orderItems, paymentMethod);
      applyBootstrap(result.bootstrap);
      setPaymentHistory((current) => [result.payment, ...current]);
      return result;
    } catch {
      return null;
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
    void mutateApi(`/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
  };

  const addTask = (section: RoutineSection, title: string) => {
    if (!title.trim()) {
      return;
    }
    setTasks((current) => [
      ...current,
      {
        id: `task-${Date.now()}`,
        section,
        title: title.trim(),
        tag: 'planning',
        timeLabel: section === 'morning' ? '9:15 AM' : section === 'afternoon' ? '4:30 PM' : '9:00 PM',
        priority: 'medium',
        completed: false,
      },
    ]);
    void mutateApi('/tasks', {
      method: 'POST',
      body: JSON.stringify({ section, title: title.trim() }),
    });
  };

  const toggleHabit = (habitId: string) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }
        const completedDays = [...habit.completedDays];
        completedDays[6] = !completedDays[6];
        return {
          ...habit,
          completedDays,
          streak: completedDays[6]
            ? habit.streak + 1
            : Math.max(0, habit.streak - 1),
        };
      }),
    );
    void mutateApi(`/habits/${habitId}/toggle`, {
      method: 'PATCH',
    });
  };

  const logWater = (amount = 1) => {
    setHealth((current) => ({
      ...current,
      waterGlasses: Math.min(current.waterGlasses + amount, current.waterGoal),
    }));
    void mutateApi('/health/water/log', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  };

  const toggleWorkout = (workoutId: string) => {
    const target = workouts.find((workout) => workout.id === workoutId);
    if (!target) {
      return;
    }
    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === workoutId
          ? { ...workout, completed: !workout.completed }
          : workout,
      ),
    );
    setHealth((current) => ({
      ...current,
      caloriesBurned: target.completed
        ? Math.max(0, current.caloriesBurned - target.calories)
        : current.caloriesBurned + target.calories,
    }));
    void mutateApi(`/workouts/${workoutId}/toggle`, {
      method: 'PATCH',
    });
  };

  const completeMeal = (mealId: string) => {
    setMeals((current) =>
      current.map((meal) =>
        meal.id === mealId ? { ...meal, completed: !meal.completed } : meal,
      ),
    );
    void mutateApi(`/meals/${mealId}/toggle`, {
      method: 'PATCH',
    });
  };

  const askAssistant = (query: string) => {
    const normalized = query.toLowerCase().trim();
    const budget = parseBudget(normalized);

    if (
      normalized.includes('hungry') ||
      normalized.includes('food') ||
      normalized.includes('order') ||
      normalized.includes('dinner') ||
      normalized.includes('lunch')
    ) {
      const candidateProducts = products
        .filter((product) => product.category === 'food')
        .filter((product) => (budget ? product.price <= budget : true))
        .filter((product) =>
          normalized.includes('healthy')
            ? product.tags.includes('healthy')
            : true,
        )
        .slice(0, 3);

      const cards = candidateProducts.map((product) => {
        const vendor = vendors.find((entry) => entry.id === product.vendorId);
        return {
          id: `assistant-food-${product.id}`,
          type: 'food' as const,
          title: product.name,
          subtitle: vendor ? `${vendor.name} • ${vendor.etaLabel}` : 'Nearby vendor',
          meta: `$${product.price.toFixed(2)}${product.calories ? ` • ${product.calories} kcal` : ''}`,
          action: {
            type: 'order_product' as const,
            label: 'Order now',
            productId: product.id,
          },
          secondaryAction: {
            type: 'add_to_cart' as const,
            label: 'Add to cart',
            productId: product.id,
          },
        };
      });

      return {
        text:
          cards.length > 0
            ? `Here are the best nearby picks for you right now. I filtered them with your current context${budget ? ` and the $${budget} budget` : ''}.`
            : 'I could not find a nearby food option matching that budget, but I can still open the marketplace for a wider search.',
        cards:
          cards.length > 0
            ? cards
            : [
                {
                  id: 'assistant-food-fallback',
                  type: 'food',
                  title: 'Browse the marketplace',
                  subtitle: 'Open nearby food and delivery options',
                  meta: 'Marketplace',
                  action: {
                    type: 'open_route',
                    route: '/marketplace',
                    label: 'Open Marketplace',
                  },
                },
              ],
      };
    }

    if (
      normalized.includes('plan') ||
      normalized.includes('day') ||
      normalized.includes('schedule') ||
      normalized.includes('routine')
    ) {
      const upcomingTasks = tasks.filter((task) => !task.completed).slice(0, 3);
      return {
        text: `I pulled your routine, mood, and productivity trend. These are the best next tasks to keep the day moving cleanly.`,
        cards: upcomingTasks.map((task) => ({
          id: `assistant-task-${task.id}`,
          type: 'task',
          title: task.title,
          subtitle: `${task.section} • ${task.timeLabel ?? 'Flexible'}`,
          meta: `${task.priority} priority`,
          action: {
            type: 'toggle_task',
            label: 'Mark done',
            taskId: task.id,
          },
          secondaryAction: {
            type: 'open_route',
            label: 'Open Routine',
            route: '/routine',
          },
        })),
      };
    }

    if (
      normalized.includes('health') ||
      normalized.includes('workout') ||
      normalized.includes('steps') ||
      normalized.includes('water') ||
      normalized.includes('sleep')
    ) {
      const nextWorkout = workouts.find((workout) => !workout.completed) ?? workouts[0];
      return {
        text: `Your health score is ${healthScore.toFixed(
          0,
        )}/100 today. Water and step progress are the easiest wins right now.`,
        cards: [
          {
            id: 'assistant-health-water',
            type: 'health',
            title: 'Hydration boost',
            subtitle: `${health.waterGlasses}/${health.waterGoal} glasses completed`,
            meta: `${health.waterGoal - health.waterGlasses} to go`,
            action: {
              type: 'log_water',
              label: 'Log one glass',
            },
          },
          {
            id: `assistant-health-workout-${nextWorkout.id}`,
            type: 'health',
            title: nextWorkout.name,
            subtitle: `${nextWorkout.durationLabel} • ${nextWorkout.intensity}`,
            meta: `${nextWorkout.calories} kcal`,
            action: {
              type: 'toggle_workout',
              label: nextWorkout.completed ? 'Undo workout' : 'Start workout',
              workoutId: nextWorkout.id,
            },
            secondaryAction: {
              type: 'open_route',
              label: 'Open Health',
              route: '/health',
            },
          },
        ],
      };
    }

    if (
      normalized.includes('budget') ||
      normalized.includes('finance') ||
      normalized.includes('money') ||
      normalized.includes('spend')
    ) {
      const hotCategories = [...finance.categories]
        .sort((left, right) => right.spent / right.budget - left.spent / left.budget)
        .slice(0, 3);
      return {
        text: `You are currently saving ${savingsRate}% of income this month. Here are the categories that need the most attention.`,
        cards: hotCategories.map((category) => ({
          id: `assistant-finance-${category.id}`,
          type: 'finance',
          title: category.name,
          subtitle: `$${category.spent.toFixed(0)} of $${category.budget.toFixed(0)} used`,
          meta: `${Math.round((category.spent / category.budget) * 100)}% of budget`,
          action: {
            type: 'open_route',
            label: 'Open Finance',
            route: '/finance',
          },
        })),
      };
    }

    if (
      normalized.includes('mood') ||
      normalized.includes('tired') ||
      normalized.includes('stressed')
    ) {
      return {
        text: `I can adapt the whole app to your energy level. If you want, I will switch you into a lighter plan for the rest of the day.`,
        cards: [
          {
            id: 'assistant-mood-tired',
            type: 'summary',
            title: 'Set tired mode',
            subtitle: 'Lighter food, easier workout, simpler evening plan',
            meta: 'Context mode',
            action: {
              type: 'set_mood',
              label: 'Use tired mode',
              mood: 'tired',
            },
          },
          {
            id: 'assistant-mood-focused',
            type: 'summary',
            title: 'Set focused mode',
            subtitle: 'Keep the current pace with a clean work block',
            meta: 'Context mode',
            action: {
              type: 'set_mood',
              label: 'Use focused mode',
              mood: 'focused',
            },
          },
        ],
      };
    }

    return {
      text: `I can help with ordering, planning, health, finance, and mood-based suggestions. Try asking me to order food, plan your day, check your health, or review your budget.`,
      cards: [
        {
          id: 'assistant-default-marketplace',
          type: 'summary',
          title: 'Browse nearby stores',
          subtitle: 'Food, groceries, fashion, pharmacy, and tech',
          meta: 'Marketplace',
          action: {
            type: 'open_route',
            label: 'Open Marketplace',
            route: '/marketplace',
          },
        },
        {
          id: 'assistant-default-routine',
          type: 'summary',
          title: 'Review today plan',
          subtitle: 'See tasks, habits, and next actions',
          meta: 'Routine',
          action: {
            type: 'open_route',
            label: 'Open Routine',
            route: '/routine',
          },
        },
      ],
    };
  };

  const queryAssistant = async (query: string) => {
    try {
      return await queryAssistantApi(query);
    } catch {
      return askAssistant(query);
    }
  };

  const executeAssistantAction = (action: AssistantAction) => {
    switch (action.type) {
      case 'order_product': {
        const product = action.productId
          ? products.find((entry) => entry.id === action.productId)
          : null;
        if (!product) {
          return { text: 'I could not find that product anymore.' };
        }
        placeProductOrder(product.id);
        return {
          text: `${product.name} is ordered. I added live tracking to the marketplace and the spend to finance.`,
          navigateTo: '/marketplace',
        };
      }
      case 'add_to_cart': {
        if (!action.productId) {
          return { text: 'There is no product attached to that action.' };
        }
        const product = products.find((entry) => entry.id === action.productId);
        if (!product) {
          return { text: 'That item is no longer available.' };
        }
        addCartItem(action.productId);
        return {
          text: `${product.name} is now in your cart.`,
          navigateTo: '/marketplace',
        };
      }
      case 'toggle_task': {
        if (!action.taskId) {
          return { text: 'I need a task to update.' };
        }
        const task = tasks.find((entry) => entry.id === action.taskId);
        if (!task) {
          return { text: 'That task no longer exists.' };
        }
        toggleTask(action.taskId);
        return {
          text: `${task.title} is updated in your routine.`,
          navigateTo: '/routine',
        };
      }
      case 'add_task': {
        if (!action.section || !action.title) {
          return { text: 'I need a title and section to add that task.' };
        }
        addTask(action.section, action.title);
        return {
          text: `${action.title} was added to your ${action.section} plan.`,
          navigateTo: '/routine',
        };
      }
      case 'log_water': {
        logWater(1);
        return {
          text: `Water logged. You are now at ${Math.min(
            health.waterGlasses + 1,
            health.waterGoal,
          )}/${health.waterGoal} glasses today.`,
          navigateTo: '/health',
        };
      }
      case 'toggle_workout': {
        if (!action.workoutId) {
          return { text: 'I need a workout to update.' };
        }
        const workout = workouts.find((entry) => entry.id === action.workoutId);
        if (!workout) {
          return { text: 'That workout could not be found.' };
        }
        toggleWorkout(action.workoutId);
        return {
          text: `${workout.name} is now ${workout.completed ? 'marked incomplete' : 'marked complete'}.`,
          navigateTo: '/health',
        };
      }
      case 'set_mood': {
        if (!action.mood) {
          return { text: 'I need to know which mood to apply.' };
        }
        setMood(action.mood);
        return {
          text: `Mood updated to ${action.mood}. I will adapt the dashboard and suggestions around it.`,
        };
      }
      case 'open_route':
        return {
          text: 'Opening the relevant area for you.',
          navigateTo: action.route,
        };
      default:
        return { text: 'That action is not supported yet.' };
    }
  };

  return (
    <AiosAppContext.Provider
      value={{
        profile,
        mood,
        setMood,
        todayLabel,
        vendors,
        products,
        quickProducts,
        tasks,
        tasksBySection,
        habits,
        workouts,
        meals,
        health,
        finance,
        notifications,
        unreadNotifications,
        cartItems,
        cartCount,
        cartSubtotal,
        activeOrder,
        recentOrders,
        healthScore,
        productivityScore,
        completedTaskCount,
        totalTaskCount,
        caloriesConsumed,
        monthlyIncomeTotal,
        totalExpenses,
        savings,
        savingsRate,
        financeInsight,
        dashboardInsights,
        paymentHistory,
        addCartItem,
        updateCartQuantity,
        clearCart,
        placeCartOrder,
        placeProductOrder,
        checkoutCart,
        toggleTask,
        addTask,
        toggleHabit,
        logWater,
        toggleWorkout,
        completeMeal,
        askAssistant,
        queryAssistant,
        executeAssistantAction,
      }}
    >
      {children}
    </AiosAppContext.Provider>
  );
}

export function useAiosApp() {
  const context = useContext(AiosAppContext);
  if (!context) {
    throw new Error('useAiosApp must be used within AiosAppProvider');
  }
  return context;
}
