export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {}
