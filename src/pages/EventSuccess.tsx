import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, QrCode, ArrowRight, Download } from "lucide-react";
import { logger } from "@/lib/logger";
import { useTranslation } from "react-i18next";
import PageContainer from "@/components/layout/PageContainer";
import { exportQrCodeAsImage } from "@/lib/export";

const EventSuccess = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [event, setEvent] = useState<{
    id: string;
    short_code: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, short_code, name")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (error) {
        logger.error(error as Error, { category: "Events" });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug, navigate]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("eventSuccess.loading")}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-md mx-auto text-center space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <div className="bg-success/10 p-4 rounded-full shadow-glow-primary/10 inline-flex mx-auto animate-bounce-subtle">
            <Check className="h-12 w-12 text-success" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {t("eventSuccess.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("eventSuccess.description")}
          </p>
        </div>

        <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <QrCode className="h-24 w-24" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("eventSuccess.codeLabel")}
            </p>
            <p className="text-6xl font-black tracking-tighter font-mono text-foreground">
              {event?.short_code}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <Button
            variant="outline"
            size="xl"
            shape="pill"
            className="w-full"
            onClick={() =>
              exportQrCodeAsImage(event?.id || "", event?.name || "event")
            }
          >
            <Download className="h-5 w-5 mr-2" aria-hidden="true" />
            {t("common.buttons.downloadQrCode")}
          </Button>

          <Link to={`/event/${slug}`} className="block">
            <Button
              variant="default"
              size="xl"
              shape="pill"
              glow="primary"
              className="w-full"
            >
              {t("common.buttons.goToEvent")}
              <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default EventSuccess;
