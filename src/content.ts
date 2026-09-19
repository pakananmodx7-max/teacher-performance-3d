export type AccentTheme = "neutral" | "part1" | "part2" | "closing";

export interface BulletItem {
  title: string;
  detail: string;
}

export type Slide =
  | {
      kind: "cover";
      theme: AccentTheme;
      eyebrow: string;
      title: string;
      subtitle: string;
      meta: { label: string; value: string }[];
    }
  | {
      kind: "agenda";
      theme: AccentTheme;
      title: string;
      items: { code: string; label: string; description: string }[];
    }
  | {
      kind: "section";
      theme: AccentTheme;
      index: string;
      title: string;
      subtitle: string;
    }
  | {
      kind: "content";
      theme: AccentTheme;
      kicker: string;
      title: string;
      description: string;
      bullets: BulletItem[];
    }
  | {
      kind: "outcome";
      theme: AccentTheme;
      kicker: string;
      title: string;
      description: string;
      quantitative: BulletItem[];
      qualitative: BulletItem[];
    }
  | {
      kind: "closing";
      theme: AccentTheme;
      title: string;
      subtitle: string;
      note: string;
    };

// แก้ไขข้อมูลด้านล่างนี้ให้ตรงกับข้อมูลของครูแต่ละท่านก่อนนำเสนอจริง
export const slides: Slide[] = [
  {
    kind: "cover",
    theme: "neutral",
    eyebrow: "การนำเสนอผลการปฏิบัติงาน",
    title: "ข้อตกลงในการพัฒนางาน (PA)",
    subtitle: "ต่อคณะกรรมการประเมินผลการปฏิบัติงาน",
    meta: [
      { label: "ผู้นำเสนอ", value: "ชื่อ-สกุล ผู้รับการประเมิน" },
      { label: "ตำแหน่ง / วิทยฐานะ", value: "ครู / ตำแหน่งที่ขอรับการประเมิน" },
      { label: "สถานศึกษา", value: "ชื่อโรงเรียน สังกัด" },
      { label: "ปีการศึกษา", value: "ปีการศึกษา 25XX" },
    ],
  },
  {
    kind: "agenda",
    theme: "neutral",
    title: "โครงสร้างการนำเสนอ",
    items: [
      {
        code: "01",
        label: "ส่วนที่ 1",
        description: "ข้อตกลงในการพัฒนางานตามมาตรฐานตำแหน่ง",
      },
      {
        code: "02",
        label: "ส่วนที่ 2",
        description: "ประเด็นท้าทายในการพัฒนาผลลัพธ์การเรียนรู้ของผู้เรียน",
      },
    ],
  },
  {
    kind: "section",
    theme: "part1",
    index: "ส่วนที่ 1",
    title: "ข้อตกลงในการพัฒนางาน",
    subtitle: "ตามมาตรฐานตำแหน่ง",
  },
  {
    kind: "content",
    theme: "part1",
    kicker: "ส่วนที่ 1 · ด้านที่ 1",
    title: "การจัดการเรียนรู้",
    description:
      "การออกแบบและจัดกระบวนการเรียนรู้ที่เน้นผู้เรียนเป็นสำคัญ ตั้งแต่การวางแผนหลักสูตรจนถึงการวัดและประเมินผล",
    bullets: [
      { title: "สร้างและพัฒนาหลักสูตร", detail: "ออกแบบหน่วยการเรียนรู้ให้สอดคล้องกับมาตรฐานและบริบทผู้เรียน" },
      { title: "ออกแบบกิจกรรมการเรียนรู้", detail: "จัดกิจกรรมที่ส่งเสริมทักษะการคิดและการลงมือปฏิบัติ" },
      { title: "จัดบรรยากาศการเรียนรู้", detail: "สร้างสภาพแวดล้อมที่เอื้อต่อการเรียนรู้และปลอดภัย" },
      { title: "วัดและประเมินผล", detail: "ใช้เครื่องมือวัดผลที่หลากหลายและสะท้อนพัฒนาการผู้เรียน" },
    ],
  },
  {
    kind: "content",
    theme: "part1",
    kicker: "ส่วนที่ 1 · ด้านที่ 2",
    title: "การส่งเสริมและสนับสนุนการจัดการเรียนรู้",
    description:
      "การดูแลช่วยเหลือผู้เรียนอย่างเป็นระบบ โดยใช้ข้อมูลผู้เรียนเป็นฐานในการวางแผนพัฒนา",
    bullets: [
      { title: "จัดทำข้อมูลผู้เรียนเป็นรายบุคคล", detail: "รวบรวมและวิเคราะห์ข้อมูลเพื่อวางแผนการสอนที่เหมาะสม" },
      { title: "ระบบดูแลช่วยเหลือผู้เรียน", detail: "คัดกรอง ติดตาม และช่วยเหลือผู้เรียนตามสภาพปัญหา" },
    ],
  },
  {
    kind: "content",
    theme: "part1",
    kicker: "ส่วนที่ 1 · ด้านที่ 3",
    title: "การพัฒนาตนเองและวิชาชีพ",
    description:
      "การเรียนรู้และพัฒนาตนเองอย่างต่อเนื่อง เพื่อยกระดับคุณภาพการจัดการเรียนรู้",
    bullets: [
      { title: "การอบรมและพัฒนาความรู้", detail: "เข้าร่วมอบรม สัมมนา เพื่อพัฒนาทักษะวิชาชีพ" },
      { title: "ชุมชนแห่งการเรียนรู้ทางวิชาชีพ (PLC)", detail: "แลกเปลี่ยนเรียนรู้ร่วมกับเพื่อนครูอย่างสม่ำเสมอ" },
    ],
  },
  {
    kind: "section",
    theme: "part2",
    index: "ส่วนที่ 2",
    title: "ประเด็นท้าทาย",
    subtitle: "ในการพัฒนาผลลัพธ์การเรียนรู้ของผู้เรียน",
  },
  {
    kind: "content",
    theme: "part2",
    kicker: "ส่วนที่ 2 · ประเด็นท้าทาย",
    title: "วิเคราะห์สภาพปัญหา",
    description: "วิเคราะห์ปัญหาหรือจุดที่ต้องพัฒนาในตัวผู้เรียน เพื่อกำหนดทิศทางการแก้ไขอย่างตรงจุด",
    bullets: [
      { title: "สภาพปัญหาที่พบ", detail: "ระบุปัญหาการเรียนรู้ของผู้เรียนที่ต้องการพัฒนา" },
      { title: "สาเหตุของปัญหา", detail: "วิเคราะห์สาเหตุเชิงลึกเพื่อวางแนวทางแก้ไขที่เหมาะสม" },
    ],
  },
  {
    kind: "content",
    theme: "part2",
    kicker: "ส่วนที่ 2 · วิธีดำเนินการ",
    title: "นวัตกรรมที่ใช้แก้ปัญหา",
    description: "ระบุวิธีดำเนินการหรือกระบวนการ/นวัตกรรมที่นำมาใช้แก้ไขปัญหาอย่างเป็นระบบ",
    bullets: [
      { title: "แนวทาง/นวัตกรรมที่ใช้", detail: "ออกแบบและพัฒนานวัตกรรมให้สอดคล้องกับสภาพปัญหา" },
      { title: "ขั้นตอนการดำเนินงาน", detail: "วางแผน ปฏิบัติ ติดตาม และปรับปรุงอย่างต่อเนื่อง" },
    ],
  },
  {
    kind: "outcome",
    theme: "part2",
    kicker: "ส่วนที่ 2 · ผลลัพธ์",
    title: "ผลลัพธ์ที่คาดหวัง",
    description: "เป้าหมาย (Target/Outcome) ที่คาดว่าจะเกิดขึ้นกับผู้เรียน ทั้งเชิงปริมาณและเชิงคุณภาพ",
    quantitative: [
      { title: "เชิงปริมาณ", detail: "ร้อยละของผู้เรียนที่มีผลสัมฤทธิ์ผ่านเกณฑ์ที่กำหนด" },
    ],
    qualitative: [
      { title: "เชิงคุณภาพ", detail: "ทักษะและพฤติกรรมการเรียนรู้ของผู้เรียนที่พัฒนาขึ้นอย่างเห็นได้ชัด" },
    ],
  },
  {
    kind: "closing",
    theme: "closing",
    title: "ขอบคุณครับ/ค่ะ",
    subtitle: "พร้อมรับข้อเสนอแนะจากคณะกรรมการ",
    note: "Q & A",
  },
];
