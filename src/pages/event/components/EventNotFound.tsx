import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TEXT } from "@/constants/text";
import PageContainer from "@/components/layout/PageContainer";

const EventNotFound = () => (
  <PageContainer className="items-center justify-center">
    <Card className="max-w-md w-full shadow-lg">
      <CardHeader>
        <CardTitle>{TEXT.event.page.notFoundTitle}</CardTitle>
        <CardDescription>{TEXT.event.page.notFoundDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to="/">
          <Button className="w-full">{TEXT.event.page.homeButton}</Button>
        </Link>
      </CardContent>
    </Card>
  </PageContainer>
);

export default EventNotFound;
