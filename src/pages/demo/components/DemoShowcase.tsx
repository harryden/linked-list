import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, Check } from "lucide-react";
import { TEXT } from "@/constants/text";

const DemoShowcase = () => {
  const [stepOne, stepTwo, stepThree, stepFour] = TEXT.demo.showcase.steps;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{stepOne.title}</CardTitle>
              <CardDescription className="text-base">
                {stepOne.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-20">
          <div className="bg-muted p-6 rounded-xl space-y-3">
            {stepOne.checklist.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{stepTwo.title}</CardTitle>
              <CardDescription className="text-base">
                {stepTwo.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-20">
          <div className="bg-muted p-6 rounded-xl">
            <div className="flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl inline-block shadow-md">
                <QrCode className="h-32 w-32 text-primary" aria-hidden="true" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {stepTwo.note}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{stepThree.title}</CardTitle>
              <CardDescription className="text-base">
                {stepThree.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-20">
          <div className="bg-muted p-6 rounded-xl space-y-4">
            <div className="space-y-2">
              <p className="font-medium">{stepThree.privacyNotice}</p>
              <div className="bg-background/80 p-4 rounded-lg border border-border">
                <p className="text-sm">{stepThree.privacyCopy}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-success">
              <Check className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">{stepThree.confirmation}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{stepFour.title}</CardTitle>
              <CardDescription className="text-base">
                {stepFour.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-20">
          <div className="bg-muted p-6 rounded-xl">
            <div className="space-y-3">
              {stepFour.attendees.map((person) => (
                <div
                  key={person.name}
                  className="flex items-center gap-3 bg-background p-4 rounded-lg border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                    {person.name.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {person.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoShowcase;
