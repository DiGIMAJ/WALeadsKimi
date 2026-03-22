import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tiers = [
  { name: "Starter", price: "₦250", credits: 200, features: ["200 WhatsApp contact exports", "Basic support"] },
  { name: "Pro", price: "₦1,500/month", credits: 999999, features: ["Unlimited exports", "Priority support", "Referral commissions"] },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pricing & Plans</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {tiers.map((tier) => (
          <Card key={tier.name} className="p-4">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold my-2">{tier.price}</p>
              <p className="text-sm mb-2">{tier.credits} credits</p>
              <ul className="list-disc pl-5 mb-4">
                {tier.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {tier.name === "Starter" && (
                <Button className="w-full">Upgrade to Starter</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}