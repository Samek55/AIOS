function nowTimeLabel() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function nowDateLabel() {
  return 'Just now';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCategoryIdForProduct(product) {
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

function getCategoryLabel(categories, categoryId) {
  const match = categories.find((item) => item.id === categoryId);
  return match ? match.name : 'Shopping';
}

function parseBudget(query) {
  const match = query.match(/\$?\s?(\d{1,3})(?:\.\d{1,2})?/);
  return match ? Number(match[1]) : null;
}

function getProduct(store, productId) {
  return store.products.find((product) => product.id === productId) || null;
}

function getVendor(store, vendorId) {
  return store.vendors.find((vendor) => vendor.id === vendorId) || null;
}

export function snapshotStore(store) {
  return JSON.parse(JSON.stringify(store));
}

export function buildDashboardBrief(store) {
  const totalTasks = store.tasks.length;
  const completedTasks = store.tasks.filter((task) => task.completed).length;
  const completedHabits = store.habits.filter((habit) => habit.completedDays[6]).length;
  const productivityScore = Math.round(
    ((completedTasks / Math.max(totalTasks, 1)) * 0.75 +
      (completedHabits / Math.max(store.habits.length, 1)) * 0.25) *
      100,
  );
  const healthScore =
    Math.round(
      (Math.min(store.health.stepsToday / store.health.stepGoal, 1) * 30 +
        Math.min(store.health.waterGlasses / store.health.waterGoal, 1) * 20 +
        Math.min(store.health.sleepHours / store.health.sleepGoal, 1) * 25 +
        (productivityScore / 100) * 25) *
        100,
    ) / 100;
  const monthlyIncomeTotal = store.finance.monthlyIncome + store.finance.extraIncome;
  const totalExpenses = store.finance.categories.reduce(
    (sum, category) => sum + category.spent,
    0,
  );
  const savings = monthlyIncomeTotal - totalExpenses;
  const savingsRate = Math.round((savings / Math.max(monthlyIncomeTotal, 1)) * 100);
  const activeOrder =
    store.orders.find((order) => order.status !== 'delivered') || null;

  return {
    todayLabel: getTodayLabel(),
    healthScore,
    productivityScore,
    monthlyIncomeTotal,
    totalExpenses,
    savings,
    savingsRate,
    activeOrder,
  };
}

export function addCartItem(store, productId, delta = 1) {
  const product = getProduct(store, productId);
  if (!product || delta === 0) {
    return null;
  }

  const existing = store.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += delta;
  } else if (delta > 0) {
    store.cart.push({ productId, quantity: delta });
  }

  store.cart = store.cart.filter((item) => item.quantity > 0);
  return store.cart;
}

export function updateCartItem(store, productId, delta) {
  return addCartItem(store, productId, delta);
}

export function clearCart(store) {
  store.cart = [];
  return store.cart;
}

export function toggleTask(store, taskId) {
  const task = store.tasks.find((entry) => entry.id === taskId);
  if (!task) {
    return null;
  }
  task.completed = !task.completed;
  return task;
}

export function addTask(store, section, title) {
  if (!title || !section) {
    return null;
  }

  const task = {
    id: `task-${Date.now()}`,
    section,
    title: String(title).trim(),
    tag: 'planning',
    timeLabel:
      section === 'morning' ? '9:15 AM' : section === 'afternoon' ? '4:30 PM' : '9:00 PM',
    priority: 'medium',
    completed: false,
  };

  store.tasks.push(task);
  return task;
}

export function toggleHabitToday(store, habitId) {
  const habit = store.habits.find((entry) => entry.id === habitId);
  if (!habit) {
    return null;
  }
  const index = habit.completedDays.length - 1;
  habit.completedDays[index] = !habit.completedDays[index];
  habit.streak = habit.completedDays[index]
    ? habit.streak + 1
    : Math.max(0, habit.streak - 1);
  return habit;
}

export function logWater(store, amount = 1) {
  store.health.waterGlasses = Math.min(
    store.health.waterGlasses + amount,
    store.health.waterGoal,
  );
  return store.health.waterGlasses;
}

export function toggleWorkout(store, workoutId) {
  const workout = store.workouts.find((entry) => entry.id === workoutId);
  if (!workout) {
    return null;
  }
  workout.completed = !workout.completed;
  store.health.caloriesBurned = workout.completed
    ? store.health.caloriesBurned + workout.calories
    : Math.max(0, store.health.caloriesBurned - workout.calories);
  return workout;
}

export function toggleMeal(store, mealId) {
  const meal = store.meals.find((entry) => entry.id === mealId);
  if (!meal) {
    return null;
  }
  meal.completed = !meal.completed;
  return meal;
}

export function setMood(store, mood) {
  store.mood = mood;
  return store.mood;
}

export function placeOrder(store, itemsInput = null) {
  const items =
    itemsInput && itemsInput.length > 0
      ? itemsInput
      : store.cart.map((item) => {
          const product = getProduct(store, item.productId);
          return product
            ? {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
              }
            : null;
        }).filter(Boolean);

  if (!items.length) {
    return null;
  }

  const itemProducts = items
    .map((item) => getProduct(store, item.productId))
    .filter(Boolean);
  if (!itemProducts.length) {
    return null;
  }

  const uniqueVendorIds = [...new Set(itemProducts.map((product) => product.vendorId))];
  const primaryVendor = getVendor(store, uniqueVendorIds[0]);
  const etaMinutes =
    uniqueVendorIds.length === 1
      ? primaryVendor?.etaMinutes || 30
      : Math.max(
          ...itemProducts.map((product) => getVendor(store, product.vendorId)?.etaMinutes || 35),
        );
  const deliveryFee = uniqueVendorIds.length === 1 ? primaryVendor?.deliveryFee || 0 : 3.99;
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const vendorName =
    uniqueVendorIds.length === 1 && primaryVendor
      ? primaryVendor.name
      : 'AIOS Local Bundle';
  const vendorId = uniqueVendorIds.length === 1 ? uniqueVendorIds[0] : 'bundle';

  const order = {
    id: `order-${Date.now()}`,
    vendorId,
    vendorName,
    status: 'preparing',
    createdAtLabel: nowDateLabel(),
    etaMinutes,
    etaLabel: `${etaMinutes} min`,
    subtotal,
    deliveryFee,
    items,
  };

  store.orders.unshift(order);

  const categoryId =
    uniqueVendorIds.length === 1 ? getCategoryIdForProduct(itemProducts[0]) : 'shopping';
  const orderTotal = subtotal + deliveryFee;

  const lastMonthlyPoint = store.finance.monthlySeries[store.finance.monthlySeries.length - 1];
  lastMonthlyPoint.expenses += orderTotal;

  store.finance.categories = store.finance.categories.map((category) =>
    category.id === categoryId
      ? { ...category, spent: category.spent + orderTotal }
      : category,
  );

  store.finance.transactions.unshift({
    id: `txn-${Date.now()}`,
    name: vendorName,
    categoryId,
    categoryLabel: getCategoryLabel(store.finance.categories, categoryId),
    amount: -orderTotal,
    dateLabel: nowDateLabel(),
    emoji: vendorName.charAt(0).toUpperCase(),
    type: 'expense',
  });

  if (itemProducts.some((product) => product.category === 'food')) {
    const totalCalories = items.reduce((sum, item) => {
      const product = getProduct(store, item.productId);
      return sum + (product?.calories || 0) * item.quantity;
    }, 0);
    store.meals.unshift({
      id: `meal-${Date.now()}`,
      meal: new Date().getHours() >= 15 ? 'Dinner' : 'Lunch',
      timeLabel: 'Tonight',
      items: `${vendorName} order`,
      calories: totalCalories || 540,
      completed: false,
      source: 'order',
    });
  }

  store.notifications.unshift({
    id: `notification-${Date.now()}`,
    kind: 'order',
    title: `Order placed with ${vendorName}`,
    body: `Estimated arrival in ${etaMinutes} minutes.`,
    timeLabel: nowTimeLabel(),
    unread: true,
  });

  store.cart = [];
  return order;
}

export function buildAssistantReply(store, query) {
  const normalized = String(query || '').toLowerCase().trim();
  const budget = parseBudget(normalized);
  const brief = buildDashboardBrief(store);

  if (
    normalized.includes('hungry') ||
    normalized.includes('food') ||
    normalized.includes('order') ||
    normalized.includes('dinner') ||
    normalized.includes('lunch')
  ) {
    const cards = store.products
      .filter((product) => product.category === 'food')
      .filter((product) => (budget ? product.price <= budget : true))
      .filter((product) => (normalized.includes('healthy') ? product.tags.includes('healthy') : true))
      .slice(0, 3)
      .map((product) => {
        const vendor = getVendor(store, product.vendorId);
        return {
          id: `assistant-food-${product.id}`,
          type: 'food',
          title: product.name,
          subtitle: vendor ? `${vendor.name} | ${vendor.etaLabel}` : 'Nearby vendor',
          meta: `$${product.price.toFixed(2)}${product.calories ? ` | ${product.calories} kcal` : ''}`,
          action: {
            type: 'order_product',
            label: 'Order now',
            productId: product.id,
          },
          secondaryAction: {
            type: 'add_to_cart',
            label: 'Add to cart',
            productId: product.id,
          },
        };
      });

    return {
      text:
        cards.length > 0
          ? `I found the strongest nearby food picks for you${budget ? ` under $${budget}` : ''}.`
          : 'I could not find a matching food option for that budget, but the marketplace can show more.',
      cards,
    };
  }

  if (
    normalized.includes('plan') ||
    normalized.includes('day') ||
    normalized.includes('schedule') ||
    normalized.includes('routine')
  ) {
    const cards = store.tasks
      .filter((task) => !task.completed)
      .slice(0, 3)
      .map((task) => ({
        id: `assistant-task-${task.id}`,
        type: 'task',
        title: task.title,
        subtitle: `${task.section} | ${task.timeLabel || 'Flexible'}`,
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
      }));

    return {
      text: 'I checked your routine, mood, and open tasks. These are the best next moves.',
      cards,
    };
  }

  if (
    normalized.includes('health') ||
    normalized.includes('workout') ||
    normalized.includes('steps') ||
    normalized.includes('water') ||
    normalized.includes('sleep')
  ) {
    const nextWorkout =
      store.workouts.find((workout) => !workout.completed) || store.workouts[0];

    return {
      text: `Your health score is ${brief.healthScore.toFixed(0)}/100 today. Water and movement are your fastest wins.`,
      cards: [
        {
          id: 'assistant-water',
          type: 'health',
          title: 'Hydration boost',
          subtitle: `${store.health.waterGlasses}/${store.health.waterGoal} glasses done`,
          meta: `${store.health.waterGoal - store.health.waterGlasses} to go`,
          action: {
            type: 'log_water',
            label: 'Log one glass',
          },
        },
        {
          id: `assistant-workout-${nextWorkout.id}`,
          type: 'health',
          title: nextWorkout.name,
          subtitle: `${nextWorkout.durationLabel} | ${nextWorkout.intensity}`,
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
    const cards = [...store.finance.categories]
      .sort((left, right) => right.spent / right.budget - left.spent / left.budget)
      .slice(0, 3)
      .map((category) => ({
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
      }));

    return {
      text: `You are saving ${brief.savingsRate}% of tracked income this month. These categories need the most attention.`,
      cards,
    };
  }

  if (
    normalized.includes('mood') ||
    normalized.includes('tired') ||
    normalized.includes('stressed')
  ) {
    return {
      text: 'I can adapt the full app around your current energy level.',
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
          subtitle: 'Keep momentum with a clean work block',
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
    text: 'I can help you order, plan, track health, and manage spending. Try asking for dinner, your day plan, or a budget check.',
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
}
