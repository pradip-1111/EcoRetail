import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const certifications = [
  {
    name: "LEED Certified",
    description: "Leadership in Energy and Environmental Design for building efficiency.",
    progress: 75,
    goal: "Gold",
    color: "hsl(var(--chart-1))"
  },
  {
    name: "ISO 14001",
    description: "International standard for an effective environmental management system (EMS).",
    progress: 90,
    goal: "Certified",
    color: "hsl(var(--chart-2))"
  },
  {
    name: "B Corp Certification",
    description: "Meeting high standards of verified social and environmental performance.",
    progress: 60,
    goal: "Certified",
    color: "hsl(var(--chart-3))"
  },
  {
    name: "Fair Trade Certified",
    description: "Ensuring fair prices, safe conditions, and community development for farmers and workers.",
    progress: 85,
    goal: "Certified",
    color: "hsl(var(--chart-4))"
  },
  {
    name: "Zero Waste Facility",
    description: "Diverting over 90% of waste from landfills, incineration, and the environment.",
    progress: 45,
    goal: "Certified",
    color: "hsl(var(--chart-5))"
  },
  {
    name: "1% for the Planet",
    description: "Committing to donate 1% of gross sales each year to environmental nonprofits.",
    progress: 100,
    goal: "Member",
    color: "hsl(var(--primary))"
  }
];

export default function CertificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sustainability Certifications</h1>
        <p className="text-muted-foreground">Track your progress toward environmental and social certifications.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.name}>
            <CardHeader>
              <CardTitle>{cert.name}</CardTitle>
              <CardDescription>{cert.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={cert.progress} style={{'--progress-color': cert.color} as React.CSSProperties} className="[&>div]:bg-[--progress-color]" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress: {cert.progress}%</span>
                  <span>Goal: {cert.goal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
