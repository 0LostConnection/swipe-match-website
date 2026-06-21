export type Outcome = "accepted" | "rejected";

export type PlaceChoice = {
  kind: "preset" | "custom";
  value: string;
};

export type Interests = {
  food: string[];
  topics: string[];
  custom: string[];
};

/**
 * Shape of the request sent to `/api/submit`, which forwards it to
 * `process.env.WEBHOOK_URL`. Model this on the receiver you build later.
 */
export type Submission = {
  outcome: Outcome;
  place?: PlaceChoice;
  availableDates?: string[]; // ISO date strings (yyyy-mm-dd)
  interests?: Interests;
  visitCount: number;
  rejectedBefore: boolean;
  submittedAt: string; // ISO timestamp
};
