"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ACLFAQAccordion() {
  const [activeItem, setActiveItem] = useState<string | undefined>(undefined);

  const faqItems = [
    {
      question: "What is ACL?",
      answer:
        "ACL stands for Anterior Cruciate Ligament. It's one of the major ligaments in your knee that helps stabilize the joint, preventing the tibia (shinbone) from sliding forward relative to the femur (thighbone).",
    },
    {
      question: "What causes ACL injuries?",
      answer:
        "ACL injuries often occur during sports that involve sudden stops, changes in direction, jumping, and landing. Common causes include pivoting with a foot planted, receiving a direct blow to the knee, or overextending the knee joint.",
    },
    {
      question: "What are the symptoms of an ACL injury?",
      answer:
        "Symptoms of an ACL injury may include a popping sound at the time of injury, severe pain, rapid swelling, loss of range of motion, and a feeling of instability when bearing weight on the affected leg.",
    },
    {
      question: "How is an ACL injury treated?",
      answer:
        "Treatment for an ACL injury depends on the severity and the patient's activity level. Options may include physical therapy, bracing, or surgery (ACL reconstruction). Recovery often involves a comprehensive rehabilitation program.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-white">
      <motion.div
        className="flex items-center justify-center mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaQuestionCircle className="text-darkBlue" size={50} />
      </motion.div>

      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-black"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ACL: Frequently Asked Questions
      </motion.h1>

      <motion.div
        className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={activeItem}
          onValueChange={setActiveItem}
        >
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger className="text-left text-lg font-semibold px-6 py-4 hover:bg-gray-100 transition-colors duration-200">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <motion.div
                  className="px-6 py-4 text-gray-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.answer}
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
