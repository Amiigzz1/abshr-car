import { Shield, Clock, CreditCard, UserCheck } from "lucide-react";

const features = [
  {
    name: "تمويل سريع",
    description: "موافقة مبدئية خلال 24 ساعة",
    icon: Clock,
  },
  {
    name: "أقساط مرنة",
    description: "خطط سداد تناسب ميزانيتك",
    icon: CreditCard,
  },
  {
    name: "معايير شفافة",
    description: "لا رسوم خفية أو مصاريف إضافية",
    icon: Shield,
  },
  {
    name: "خدمة متميزة",
    description: "فريق متخصص لمساعدتك",
    icon: UserCheck,
  },
];

export const Features = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
            لماذا تختار تمويلنا؟
          </h2>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-primary tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};