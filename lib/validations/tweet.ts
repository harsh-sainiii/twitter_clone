import * as z from "zod";

export const TweetValidation = z.object({
  tweet: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  // image: z.optional(z.union([z.string().url(), z.null(), z.literal("")])),
  image: z.string().url().optional().nullable(),
  accountId: z.string(),
});
console.log(TweetValidation.safeParse("").success);

export const CommentValidation = z.object({
  tweet: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  image: z.string().url().optional(),
});
