export type SubscriptionPlan = {
    id: string;
    name: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
    }
    currency: string;
    features: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    trialPeriodDays?: number; // Optional field for trial period
    userBasedPricing?:boolean
    minUsers?: number; // Minimum number of users for the plan
    maxUsers?: number; // Maximum number of users for the plan
    badge?: string; // Optional badge for the plan
    highlight?: boolean; // Optional highlight for the plan
}