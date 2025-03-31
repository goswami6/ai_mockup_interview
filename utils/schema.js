import { serial, varchar, text } from "drizzle-orm/pg-core"; // ✅ Use pg-core
import { pgTable } from "drizzle-orm/pg-core"; // ✅ Use pg-core

export const MockInterview = pgTable('mockInterview',{
    id:serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
    jobDesc: varchar('jobDesc', { length: 255 }).notNull(),
    jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
    createdBy: varchar('createdBy', { length: 255 }).notNull(),
    createdAt: varchar('createdAt', { length: 255 }).notNull(),
    mockId: varchar('mockId', { length: 255 }).notNull()
})

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    confidence: varchar('confidence'),  // ✅ Added confidence field
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt'),
});


export const CodingQuestions = pgTable('codingQuestions', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(), // JSON response with coding questions
    jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
    jobDesc: varchar('jobDesc', { length: 255 }).notNull(),
    jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
    company: varchar('company', { length: 255 }).notNull(), // Company name added
    createdBy: varchar('createdBy', { length: 255 }).notNull(),
    createdAt: varchar('createdAt', { length: 255 }).notNull(),
    mockId: varchar('mockId', { length: 255 }).notNull()
});