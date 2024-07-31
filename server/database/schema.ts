import { sqliteTable, text, json, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm';

export const donors = sqliteTable('donors', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  firstName: text('firstName'),
  lastName: text('lastName'),
  businessName: text('businessName'),

  email: text('email'),
  phone: text('phone'),

  isIndividual: integer('isIndividual').notNull(),
  isBusiness: integer('isBusiness').notNull(),

  address: text('address1'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const receivables = sqliteTable('receivables', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const donations = sqliteTable('donations', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  donorId: integer('donorId').references(() => donors.id).notNull(),

  itemCounts: text('itemCounts', { mode: 'json' }).notNull(),

  totalCount: integer('totalCount').notNull(),

  notes: text('notes'),

  dataDestruction: integer('isIndividual').notNull().default(0),

  receivedBy: text('receivedBy').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),

})

export const donorRelations = relations(donors, ({ many }) => ({
  donations: many(donations)
}));

export const donationRelations = relations(donations, ({ one }) => ({
  donor: one(donors, {
    fields: [donations.donorId],
    references: [donors.id],
  })
}));