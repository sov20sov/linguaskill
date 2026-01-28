
export interface Course {
  id: string;
  title: string;
  level: string;
  description: string;
  outcomes: string[];
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface NavItem {
  label: string;
  href: string;
}
