import React from "react";

function Features() {
  const features = [
    {
      title: "Real-time Messaging",
      description: "Instant message delivery with real-time updates",
    },
    {
      title: "Secure Chats",
      description: "End-to-end encryption for your privacy",
    },
    {
      title: "Group Chats",
      description: "Connect with multiple friends simultaneously",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {feature.title}
            </h3>
            <p className="text-slate-50">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
