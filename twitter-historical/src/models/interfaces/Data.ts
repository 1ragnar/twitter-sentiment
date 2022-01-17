export interface IResponse {
    data: ITweet[];
    includes: Includes;
    meta: IMeta;
}

export interface IMeta {
    newest_id: string;
    oldest_id: string;
    next_token: string;
}

export interface Includes {
    users: IUser[];
    tweets: ITweet[];
}

export interface IUser {
    name: string;
    username: string;
    created_at: string;
    public_metrics: UserPublicmetrics;
    id: string;
}

export interface UserPublicmetrics {
    followers_count: number;
    following_count: number;
}

export interface ITweet {
    text: string;
    id: string;
    public_metrics: TweetPublicmetrics;
    referenced_tweets?: Referencedtweet[];
    author_id: string;
    created_at: string;
}

export interface Referencedtweet {
    type: "retweeted" | "replied_to";
    id: string;
}

export interface TweetPublicmetrics {
    retweet_count: number;
    like_count: number;
}

export interface IExtendedTweet {
    text: string;
    id: string;
    public_metrics: TweetPublicmetrics;
    author: IUser;
    created_at: string;
}

export interface ITweetInDB {
    tweet: IExtendedTweet
}
export interface ISentiment {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
    tweet_created_at: Date;
}

export interface IDailySentiment {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
}

export interface IPrice {
    time: Date;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
    close: number;

}