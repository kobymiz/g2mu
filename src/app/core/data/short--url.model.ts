export type ShortUrl = {
    key: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    
    longUrl: string;    
    title?: string;
    description?: string;    

    active: boolean;
    deactivatedAt?: Date;
    deactivatedBy?: string;
    lastAccessedAt?: Date;
    totalAccessCount: number;    
}

export type CreateShortUrlRequest = {
    key: string;
    longUrl: string;
    title?: string;
    description?: string;    
}