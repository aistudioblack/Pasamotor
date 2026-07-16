import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000}>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Icon matching
        let Icon = Info;
        let iconColor = "text-blue-500";
        const lowTitle = (title?.toString() || "").toLowerCase();
        const lowDesc = (description?.toString() || "").toLowerCase();

        if (variant === "destructive") {
          Icon = AlertCircle;
          iconColor = "text-red-500";
        } else if (variant === "success") {
          Icon = CheckCircle2;
          iconColor = "text-emerald-500";
        } else if (variant === "warning") {
          Icon = AlertCircle;
          iconColor = "text-amber-500";
        } else if (variant === "info") {
          Icon = Info;
          iconColor = "text-blue-500";
        } else if (lowTitle.includes("hata") || lowTitle.includes("başarısız") || lowDesc.includes("hata")) {
          Icon = AlertCircle;
          iconColor = "text-red-500";
        } else if (
          lowTitle.includes("başarıyla") || 
          lowTitle.includes("kaydedildi") || 
          lowTitle.includes("yayınlandı") || 
          lowTitle.includes("onaylandı") ||
          lowTitle.includes("silindi") ||
          lowTitle.includes("güncellendi") ||
          lowTitle.includes("oluşturuldu") ||
          lowTitle.includes("gönderildi") ||
          lowTitle.includes("başarı")
        ) {
          Icon = CheckCircle2;
          iconColor = "text-emerald-500";
        } else {
          Icon = Info;
          iconColor = "text-amber-500"; // Paşa Motor branding theme color
        }

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 w-full pr-2">
              <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                <Icon className="w-5 h-5 animate-in zoom-in-75 duration-200" />
              </div>
              <div className="grid gap-1 flex-1 min-w-0">
                {title && <ToastTitle className="text-sm font-semibold tracking-tight text-foreground">{title}</ToastTitle>}
                {description && <ToastDescription className="text-xs text-muted-foreground leading-relaxed">{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose className="text-muted-foreground/60 hover:text-foreground transition-colors" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
