# Webhooks – Complete Guide (Beginner → Advanced)

## 1. What is a Webhook?

A **Webhook** is a way for one application to send **real-time data** to another application automatically when a specific event happens.

Instead of repeatedly asking a server **"Has something happened?"**, the server **pushes the data immediately** when the event occurs.

In simple words:

> A webhook is an **HTTP callback triggered by an event**.

It usually sends data through an **HTTP POST request** to a predefined URL.

---

# 2. Why Webhooks are Needed

Before webhooks existed, applications used **Polling**.

### Polling Example

Application A repeatedly asks Application B:

```
Did the payment happen?
Did the payment happen?
Did the payment happen?
```

This wastes:

* CPU
* API calls
* Network bandwidth
* Time

### Webhook Solution

Application B immediately sends data when the event occurs.

```
Payment successful → send webhook → notify application A
```

This is:

* Faster
* Efficient
* Real-time
* Scalable

---

# 3. Real Life Example

### Payment Gateway

Suppose you integrate a payment gateway.

Steps:

1. User clicks **Pay Now**
2. User completes payment on the gateway page
3. Payment gateway processes transaction
4. Payment gateway sends **webhook to your server**
5. Your server updates **order status**

Example:

```
User → Payment Gateway → Payment Completed
                          ↓
                   Webhook Sent
                          ↓
                     Your Server
                          ↓
                   Order Status Updated
```

---

# 4. How Webhooks Work

Webhooks follow a **producer → consumer model**.

### Step 1 – Register Webhook URL

You give your endpoint URL to a service.

Example:

```
https://yourapp.com/api/webhook
```

### Step 2 – Event Occurs

Example event:

* payment completed
* order shipped
* user registered
* email delivered

### Step 3 – HTTP Request Sent

The service sends an **HTTP POST request** to your webhook endpoint.

Example:

```
POST /api/webhook HTTP/1.1
Content-Type: application/json
```

Payload example:

```json
{
  "event": "payment.success",
  "amount": 1000,
  "currency": "INR",
  "user_id": "123"
}
```

### Step 4 – Your Server Processes Data

Your backend receives the webhook and updates the database.

Example:

```
payment.status = "SUCCESS"
```

---

# 5. Webhook vs API

| Feature       | Webhook              | API                     |
| ------------- | -------------------- | ----------------------- |
| Communication | Server → Server push | Client → Server request |
| Data flow     | Automatic            | On demand               |
| Real-time     | Yes                  | Usually polling         |
| Trigger       | Event-based          | Request-based           |

Example:

API

```
GET /payments/123
```

Webhook

```
POST /webhook/payment-success
```

---

# 6. Webhook Request Structure

A webhook request contains:

### 1. HTTP Method

Usually:

```
POST
```

### 2. Headers

Example:

```
Content-Type: application/json
User-Agent: PaymentService
```

### 3. Payload (Body)

Example:

```json
{
 "event": "payment.completed",
 "data": {
   "orderId": "123",
   "amount": 2000
 }
}
```

---

# 7. Building a Webhook in Node.js (Example)

Example webhook endpoint.

```javascript
import express from "express"

const app = express()
app.use(express.json())

app.post("/webhook", (req, res) => {

    const event = req.body

    console.log("Webhook received:", event)

    if(event.type === "payment.success"){
        // update database
        console.log("Payment Successful")
    }

    res.status(200).send("Webhook received")
})

app.listen(3000)
```

---

# 8. Webhooks in Next.js

Example API route.

```
app/api/webhook/route.ts
```

```javascript
import { NextResponse } from "next/server"

export async function POST(req) {

    const body = await req.json()

    console.log("Webhook Event:", body)

    return NextResponse.json({ success: true })
}
```

---

# 9. Webhook Security (Very Important)

Webhooks can be dangerous if not secured.

Attackers can send fake webhook requests.

To prevent this we use:

### 1. Signature Verification

The sender signs the payload using a **secret key**.

Example header:

```
X-Signature: abc123xyz
```

Server verifies signature before processing.

---

### 2. Secret Tokens

Webhook URL contains secret token.

Example:

```
/webhook/payment?secret=abc123
```

---

### 3. IP Whitelisting

Allow requests only from trusted IPs.

Example:

```
Allow only Stripe IPs
```

---

# 10. Idempotency (Avoid Duplicate Processing)

Webhook providers may send **same event multiple times**.

Example:

```
Payment success webhook sent twice
```

Your server must handle duplicates.

Solution:

Store **event ID in database**.

Example:

```
if(eventAlreadyProcessed){
   ignore
}
```

---

# 11. Retry Mechanism

If your server fails to respond:

```
HTTP 500
```

Webhook provider retries.

Example retry pattern:

```
1 minute
5 minutes
30 minutes
2 hours
```

---

# 12. Common Webhook Providers

Popular services using webhooks:

* GitHub
* Stripe
* Razorpay
* PayPal
* Slack
* Shopify
* Discord

Examples of events:

```
push
payment_succeeded
order_created
email_opened
deployment_completed
```

---

# 13. Webhook Testing Tools

Useful tools:

### 1. Ngrok

Expose localhost to internet.

```
ngrok http 3000
```

Example:

```
https://abc123.ngrok.io/webhook
```

---

### 2. Webhook.site

Inspect webhook payloads.

```
https://webhook.site
```

---

# 14. Webhook Architecture (Production)

Typical architecture:

```
External Service
       │
       │ Webhook
       ▼
Load Balancer
       │
       ▼
Webhook Server
       │
       ▼
Queue (RabbitMQ / Kafka)
       │
       ▼
Worker
       │
       ▼
Database
```

Why queues?

* Prevent overload
* Handle spikes
* Async processing

---

# 15. Webhook Best Practices

1. Always verify signature
2. Respond quickly (<5 seconds)
3. Process data asynchronously
4. Handle duplicate events
5. Log webhook events
6. Use retries
7. Secure endpoint

---

# 16. Example Real Flow (Payment)

```
User clicks Pay
        │
        ▼
Payment Gateway
        │
        ▼
Payment Success
        │
        ▼
Webhook sent to /api/payment-webhook
        │
        ▼
Backend verifies signature
        │
        ▼
Update order status
        │
        ▼
Send confirmation email
```

---

# 17. Webhooks vs Message Queues

| Feature     | Webhook             | Message Queue     |
| ----------- | ------------------- | ----------------- |
| Protocol    | HTTP                | Messaging system  |
| Reliability | Medium              | High              |
| Real-time   | Yes                 | Yes               |
| Use case    | Event notifications | Heavy async tasks |

Example MQ systems:

* Kafka
* RabbitMQ
* Redis Queue
* AWS SQS

---

# 18. Common Problems with Webhooks

### Duplicate events

Solution: Idempotency.

### Server downtime

Solution: Retry mechanism.

### Security risks

Solution:

* signature verification
* authentication

### Slow processing

Solution:

* queue workers

---

# 19. Webhooks in Microservices

In microservices architecture:

```
Service A → webhook → Service B
```

Example:

```
Payment Service → Order Service
Order Service → Notification Service
```

---

# 20. Summary

A **Webhook** is:

* Event-driven
* Real-time communication
* Server-to-server notification system
* HTTP-based callback

Used widely in:

* payment systems
* CI/CD pipelines
* messaging apps
* microservices

---

# Final One-Line Definition

> A webhook is an **event-triggered HTTP request sent from one system to another to notify it about a specific event in real time.**

---
