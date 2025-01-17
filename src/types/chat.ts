export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export interface UserData {
  nationality: string;
  phone: string;
  city: string;
  salary: number;
  bank: string;
  obligations: number;
  workSector: string;
  employer: string;
  carType: string;
  modelAndColor: string;
}

export const saudiCities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
  "الخبر", "الظهران", "تبوك", "خميس مشيط", "الطائف"
];

export const saudiBanks = [
  "البنك الأهلي السعودي", "بنك الراجحي", "بنك الرياض",
  "البنك السعودي الفرنسي", "البنك السعودي البريطاني",
  "بنك الجزيرة", "البنك العربي الوطني", "بنك البلاد"
];

export const workSectors = [
  "حكومي", "عسكري", "قطاع خاص", "أعمال حرة"
];

export type DataField = {
  key: keyof UserData;
  question: string;
  suggestions?: string[];
  validation?: (value: any) => boolean;
};

export const dataFields: DataField[] = [
  { key: 'nationality', question: 'ما هي جنسيتك؟', suggestions: ["سعودي", "مقيم"] },
  { key: 'phone', question: 'ما هو رقم جوالك؟ (يجب أن يبدأ بـ 05)', validation: (value: string) => /^05\d{8}$/.test(value) },
  { key: 'city', question: 'في أي مدينة تسكن؟', suggestions: saudiCities },
  { key: 'salary', question: 'كم يبلغ راتبك الشهري؟', validation: (value: number) => value >= 3000 },
  { key: 'bank', question: 'ما هو اسم البنك الذي تتعامل معه؟', suggestions: saudiBanks },
  { key: 'obligations', question: 'كم تبلغ التزاماتك الشهرية؟', validation: (value: number) => value >= 0 },
  { key: 'workSector', question: 'ما هو قطاع عملك؟', suggestions: workSectors },
  { key: 'employer', question: 'ما هي جهة عملك؟' },
  { key: 'carType', question: 'ما نوع السيارة المطلوبة؟' },
  { key: 'modelAndColor', question: 'ما هو الموديل واللون المفضل؟' }
];