export type Subscription = {
    subscription_id: string;
    username: string;    
    
    planId: string;
    startDatetime: number;
    endDatetime?: number;

    createdAt: number;    
    cancelledAt?: number;

    billing?: {
        paymentDatetime: number;
        paymentMethod: string;
        paymentConfirmationNumber: string;
        paymentAmount: number;      
    };      

    limits: {
        minUsers: number;
        maxUsers: number;
        maxLinks: number;
        maxClicks: number;    
    }    

    active: boolean;
}



