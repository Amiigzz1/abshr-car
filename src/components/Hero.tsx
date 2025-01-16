import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">تمويل سيارتك أصبح</span>
            <span className="block text-secondary">أسهل من أي وقت مضى</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            نقدم حلول تمويل مرنة تناسب احتياجاتك. ابدأ رحلتك نحو سيارة أحلامك اليوم.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button className="rounded-full bg-secondary text-primary hover:bg-secondary/90 font-bold py-3 px-8 text-lg">
              احسب تمويلك
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};