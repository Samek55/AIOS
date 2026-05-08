export type VendorCategory =
  | 'food'
  | 'fashion'
  | 'groceries'
  | 'pharmacy'
  | 'electronics';

export type RoutineSection = 'morning' | 'afternoon' | 'evening';
export type TaskPriority = 'high' | 'medium' | 'low';
export type Mood = 'tired' | 'stressed' | 'focused' | 'good' | 'energized';
export type OrderStatus = 'preparing' | 'picked_up' | 'delivering' | 'delivered';
export type AssistantCardType = 'food' | 'health' | 'task' | 'finance' | 'summary';
export type NotificationKind = 'weather' | 'health' | 'order' | 'finance' | 'routine';
export type UserRole = 'customer' | 'vendor' | 'admin';
export type PaymentMethod = 'card' | 'cash_on_delivery';
export type PaymentStatus =
  | 'succeeded'
  | 'processing'
  | 'requires_payment_method'
  | 'requires_action'
  | 'failed';

export interface UserAddress {
  label: string;
  street: string;
  city: string;
  state: string;
}

export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  username?: string;
  avatarUrl: string;
  membership: string;
  city: string;
  state: string;
  address: UserAddress;
  bio?: string;
}

export interface Vendor {
  id: string;
  ownerUserId?: string | null;
  name: string;
  category: VendorCategory;
  subtitle: string;
  rating: number;
  etaLabel: string;
  etaMinutes: number;
  deliveryFee: number;
  imageUrl: string;
  badge?: string;
  promoText?: string;
  tag: string;
  distanceKm: number;
  active?: boolean;
}

export interface Product {
  id: string;
  vendorId: string;
  category: VendorCategory;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  emoji?: string;
  calories?: number;
  proteinGrams?: number;
  stockLabel?: string;
  stockCount?: number;
  featured?: boolean;
  active?: boolean;
  tags: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  createdAtLabel: string;
  etaMinutes: number;
  etaLabel: string;
  subtotal: number;
  deliveryFee: number;
  items: OrderItem[];
}

export interface RoutineTask {
  id: string;
  section: RoutineSection;
  title: string;
  tag: string;
  timeLabel?: string;
  priority: TaskPriority;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  goal: number;
  completedDays: boolean[];
  color: string;
}

export interface Workout {
  id: string;
  name: string;
  durationLabel: string;
  durationMinutes: number;
  calories: number;
  intensity: 'Easy' | 'Moderate' | 'Intense';
  imageUrl: string;
  completed: boolean;
}

export interface MealPlanItem {
  id: string;
  meal: string;
  timeLabel: string;
  items: string;
  calories: number;
  completed: boolean;
  source: 'plan' | 'order';
}

export interface HealthSnapshot {
  stepsToday: number;
  stepGoal: number;
  caloriesBurned: number;
  calorieGoal: number;
  waterGlasses: number;
  waterGoal: number;
  sleepHours: number;
  sleepGoal: number;
  restingHeartRate: number;
  averageHeartRate: number;
  weeklySteps: { day: string; steps: number; goal: number }[];
  heartRateSeries: { time: string; bpm: number }[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
  emoji: string;
}

export interface FinanceTransaction {
  id: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  amount: number;
  dateLabel: string;
  emoji: string;
  type: 'income' | 'expense';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  emoji: string;
  color: string;
  deadlineLabel: string;
}

export interface FinanceSnapshot {
  monthlyIncome: number;
  extraIncome: number;
  monthlySeries: { month: string; income: number; expenses: number }[];
  categories: BudgetCategory[];
  transactions: FinanceTransaction[];
  savingsGoals: SavingsGoal[];
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
}

export interface DashboardInsight {
  id: string;
  icon: string;
  text: string;
  actionLabel: string;
  action: AssistantAction;
}

export interface AssistantAction {
  type:
    | 'order_product'
    | 'add_to_cart'
    | 'toggle_task'
    | 'add_task'
    | 'log_water'
    | 'toggle_workout'
    | 'set_mood'
    | 'open_route';
  label: string;
  productId?: string;
  taskId?: string;
  section?: RoutineSection;
  title?: string;
  workoutId?: string;
  mood?: Mood;
  route?: string;
}

export interface AssistantCard {
  id: string;
  type: AssistantCardType;
  title: string;
  subtitle: string;
  meta: string;
  action?: AssistantAction;
  secondaryAction?: AssistantAction;
}

export interface AssistantReply {
  text: string;
  cards?: AssistantCard[];
}

export interface AssistantActionResult {
  text: string;
  navigateTo?: string;
}

export interface AppBootstrap {
  profile: UserProfile;
  mood: Mood;
  vendors: Vendor[];
  products: Product[];
  tasks: RoutineTask[];
  habits: Habit[];
  workouts: Workout[];
  meals: MealPlanItem[];
  health: HealthSnapshot;
  finance: FinanceSnapshot;
  notifications: AppNotification[];
  orders: Order[];
  cart: CartItem[];
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  vendorId?: string | null;
  profile: UserProfile;
  membership?: string | null;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  orderId?: string | null;
  provider: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  externalId?: string;
  createdAtLabel: string;
}

export interface CheckoutResult {
  payment: PaymentRecord;
  order?: Order | null;
  clientSecret?: string;
  requiresClientConfirmation?: boolean;
  bootstrap: AppBootstrap;
}

export interface AdminOverview {
  usersCount: number;
  vendorsCount: number;
  productsCount: number;
  activeOrders: number;
  monthlyGmv: number;
  paymentSuccessRate: number;
  aiRequestsToday: number;
  recentAuditEvents: Array<{
    id: string;
    actorUserId: string;
    scope: string;
    action: string;
    targetId: string;
    createdAtLabel: string;
    detail: Record<string, unknown>;
    actor: AuthUser;
  }>;
  vendors: Vendor[];
}

export interface VendorDashboard {
  vendor: Vendor | null;
  products: Product[];
  orders: Array<Order & { userId?: string }>;
  revenue: number;
  lowStockProducts: Product[];
}
