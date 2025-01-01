    import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
    interface ReviewCardProps {
        username: string;
        title: string;
        description: string;
        avatar: string;
        rating: number;
      }

    export function AnimatedTestimonialsDemo({
        username,
        title,
        description,
        avatar,
        // rating,
      }: ReviewCardProps) {
    const testimonials = [
        {
        quote:title,
        name: username,
        designation: description,
        src: avatar,
        },
    ];
    return <AnimatedTestimonials testimonials={testimonials} />;
    }
