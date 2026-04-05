import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { TEXT } from "@/constants/text";

const resources = {
  en: {
    translation: TEXT,
  },
  sv: {
    translation: {
      common: {
        brand: "LinkBack",
        copy: {
          footer: "© 2025 LinkBack. Drivs av LinkedIn.",
        },
        buttons: {
          signInWithLinkedIn: "Logga in med LinkedIn",
          joinEvent: "Gå med i event",
          hostEvent: "Värd för event",
          howItWorks: "Så fungerar det",
          myEvents: "Mina event",
          getStarted: "Kom igång",
          signIn: "Logga in",
          createFirstEvent: "Skapa event",
          joinByCode: "Gå med med kod",
          joinFirstEvent: "Gå med i event",
          goToDashboard: "Gå till översikt",
          goToEvent: "Gå till event",
          continueCheckIn: "Checka in",
          findingEvent: "Hittar event...",
          createEventAndQr: "Skapa event",
          creatingEvent: "Skapar event...",
          downloadQrCode: "Ladda ner QR-kod",
          viewEventDashboard: "Visa översikt",
          tryLinkBackNow: "Prova LinkBack",
          viewQrCode: "Visa QR-kod",
          cancel: "Avbryt",
        },
        links: {
          backToDashboard: "Tillbaka till översikt",
          backToHome: "Tillbaka till start",
          viewPastEvents: "Visa tidigare event",
          returnHome: "Tillbaka hem",
          backToHomeArrow: "← Tillbaka till start",
        },
        labels: {
          eventCode: "Eventkod",
          dateNotSet: "Datum ej satt",
          timeNotSet: "Tid ej satt",
        },
        ui: {
          breadcrumbMore: "Mer",
          carouselPrevious: "Föregående",
          carouselNext: "Nästa",
          paginationPrevious: "Föregående",
          paginationNext: "Nästa",
          paginationMore: "Fler sidor",
          paginationPreviousLabel: "Gå till föregående sida",
          paginationNextLabel: "Gå till nästa sida",
          close: "Stäng",
          toggleSidebar: "Växla sidofält",
        },
      },
      landing: {
        hero: {
          titleLine: "Incheckning för event.",
          highlight: "Förenklad.",
          authenticatedDescription:
            "LinkedIn-verifierad incheckning för dina event. En QR-kod, omedelbara deltagarlistor, riktiga professionella kontakter.",
          guestDescription:
            "Skapa en QR-kod. Deltagarna skannar och checkar in med LinkedIn. Bygg verifierade deltagarlistor i realtid.",
          joinButton: "Gå med i event",
          hostButton: "Värd för event",
          demoButton: "Så fungerar det",
          signInButton: "Logga in med LinkedIn",
        },
        features: {
          oneQrCode: {
            title: "En QR-kod",
            description:
              "En kod per event. Skriv ut den, visa den eller dela länken.",
          },
          linkedinVerified: {
            title: "LinkedIn-verifierad",
            description:
              "Riktiga deltagare med verifierade LinkedIn-profiler. Inga falska konton.",
          },
          instantLists: {
            title: "Omedelbara listor",
            description:
              "Deltagarlista i realtid med namn, rubriker och LinkedIn-profiler.",
          },
        },
        howItWorks: {
          title: "Så fungerar det",
          steps: [
            {
              step: "1",
              title: "Skapa ditt event",
              description:
                "Logga in och skapa ditt event. Få din unika QR-kod omedelbart.",
            },
            {
              step: "2",
              title: "Deltagare checkar in",
              description:
                "Deltagarna skannar koden och loggar in med LinkedIn. Incheckningen registreras automatiskt.",
            },
            {
              step: "3",
              title: "Visa din lista",
              description:
                "Se vem som är där i realtid. Namn, rubriker och LinkedIn-profiler inkluderas.",
            },
          ],
        },
        footerCta: {
          title: "Redo att förenkla dina event?",
          description: "Börja bygga verifierade deltagarlistor idag.",
        },
      },
      dashboard: {
        header: {
          welcomePrefix: "Välkommen tillbaka,",
          tagline: "Hantera event, checka in och kontakta deltagare.",
          signOutSuccess: "Utloggad",
        },
        loading: "Laddar översikt...",
        myEvents: {
          title: "Dina event",
          loading: "Laddar event...",
          emptyTitle: "Skapa ditt första event på 10 sekunder.",
          emptyDescription: "Skapa en QR-kod och börja nätverka.",
          viewAttendees: "Visa deltagare →",
        },
        upcoming: {
          title: "Event du har deltagit i",
          loading: "Laddar event...",
          emptyTitle: "Inga event än.",
          emptyDescription: "Ange en kod för att checka in.",
          viewAttendeeList: "Visa deltagarlista →",
        },
        greetings: {
          newJoiner: "Hej, glad att ha dig här! Redo att börja nätverka?",
          firstCheckIn: "Snyggt, du har din första incheckning!",
          firstHost:
            "Bra jobbat med ditt första event, dela den 6-siffriga koden eller QR-koden och börja nätverka!",
          welcomeBack: "Välkommen tillbaka, {name}!",
        },
      },
      demo: {
        header: {
          title: "Se det in action",
          subtitle: "Så fungerar LinkBack från början till slut",
        },
        showcase: {
          steps: [
            {
              title: "Skapa ett event",
              description: "Logga in, skapa ditt event och få din QR-kod",
              checklist: [
                'Namnge ditt event: "Tech Meetup 2025"',
                "Ställ in datum och tid (valfritt)",
                "Lägg till LinkedIn-event-URL (valfritt)",
                "Få en unik QR-kod omedelbart",
              ],
            },
            {
              title: "Visa QR-koden",
              description: "Skriv ut eller visa din kod vid ingången",
              note: "Varje event får en unik kod",
            },
            {
              title: "Deltagare checkar in",
              description: "Deltagarna skannar och loggar in med LinkedIn",
              privacyNotice: "⚠️ Integritetsmeddelande:",
              privacyCopy:
                '"Ditt LinkedIn-namn och din rubrik kommer att vara synliga för andra deltagare."',
              confirmation: "Incheckningen registreras automatiskt",
            },
            {
              title: "Visa deltagarlista",
              description: "Alla kan se vem som är på eventet",
              attendees: [
                {
                  name: "Sarah Johnson",
                  title: "Senior Product Manager at Tech Corp",
                },
                {
                  name: "Michael Chen",
                  title: "Software Engineer at StartupXYZ",
                },
                {
                  name: "Emma Davis",
                  title: "UX Designer at Creative Studio",
                },
              ],
            },
          ],
        },
        notes: {
          helper: "Ingen betalning krävs. Logga in och börja nätverka.",
        },
      },
      createEvent: {
        header: {
          backToDashboard: "Tillbaka till översikt",
          backToHome: "Tillbaka till start",
          backToEvent: "Tillbaka till event",
        },
        form: {
          title: "Skapa event",
          description: "Fyll i detaljerna för att generera din QR-kod",
          editTitle: "Redigera event",
          editDescription: "Uppdatera eventdetaljer",
          fields: {
            nameLabel: "Eventnamn *",
            namePlaceholder: "Summer Tech Meetup 2025",
            locationLabel: "Plats",
            locationPlaceholder: "TechHub Conference Center, San Francisco",
            dateLabel: "Eventdatum",
            datePlaceholder: "Välj datum",
            startTimeLabel: "Starttid",
            endTimeLabel: "Sluttid",
            linkedinUrlLabel: "LinkedIn-eventlänk (valfritt)",
            linkedinUrlPlaceholder: "https://www.linkedin.com/events/...",
          },
          submitIdle: "Skapa event",
          submitLoading: "Skapar event...",
          editSubmitIdle: "Spara ändringar",
          editSubmitLoading: "Sparar...",
        },
        toast: {
          success: "Eventet skapades",
          failure: "Kunde inte skapa event",
          authRequired: "Logga in för att skapa event",
          missingDateTime: "Välj datum och starttid",
          invalidTimeRange: "Sluttid måste vara efter starttid",
          missingEndTime: "Ange en sluttid",
        },
      },
      joinEvent: {
        header: {
          title: "Gå med i event",
          description: "Ange din eventkod för att checka in",
        },
        alert: {
          organizer:
            "Du är värd för detta event. Öppna det för att hantera incheckningar.",
        },
        form: {
          label: "Eventkod",
          placeholder: "Ange 6-siffrig kod",
          goToEvent: "Gå till event",
          submitIdle: "Checka in",
          submitLoading: "Hittar event...",
          helperText: "Eller skanna QR-koden på plats",
        },
        toast: {
          missingCode: "Ange en eventkod",
          notFound: "Eventet hittades inte. Kontrollera koden och försök igen.",
          failure: "Kunde inte hitta eventet. Försök igen.",
          organizerNotice: "Du är arrangör för detta event",
        },
      },
      auth: {
        brand: "LinkBack",
        tagline: "LinkedIn-verifierat nätverkande för event",
        card: {
          title: "Logga in med LinkedIn",
          description: "Autentisera med ditt LinkedIn-konto",
          buttonIdle: "Logga in med LinkedIn",
          buttonLoading: "Ansluter...",
        },
        info: {
          title: "Vad vi får tillgång till:",
          items: [
            {
              title: "Namn och profilbild",
              description: "För att identifiera dig på event",
            },
            {
              title: "Rubrik och e-post",
              description: "För nätverksändamål",
            },
            {
              title: "Skrivskyddad åtkomst",
              description:
                "Vi publicerar eller skickar aldrig meddelanden å dina vägnar",
            },
          ],
          consentPrefix:
            "Genom att logga in godkänner du att dela din LinkedIn-profil med arrangörer och deltagare. Återkalla åtkomst när som helst från dina",
          linkedInSettings: "LinkedIn-inställningar.",
        },
        navigation: {
          backToHome: "← Tillbaka till start",
        },
        toast: {
          failure: "Autentisering misslyckades",
        },
      },
      authCallback: {
        loadingTitle: "Autentiserar...",
        loadingDescription: "Slutför inloggning",
        errorTitle: "Autentiseringsfel",
        errorDescription: "Omdirigerar till inloggning...",
        toast: {
          sessionFailure: "Kunde inte etablera session",
          noSession: "Ingen aktiv session hittades",
          loadProfileFailure: "Kunde inte ladda profil",
          success: "Autentisering lyckades",
          genericFailure: "Autentisering misslyckades",
        },
      },
      event: {
        header: {
          hostedBy: "Värd är",
          viewProfile: "Visa profil",
          viewSelfProfile: "Visa din profil",
          linkedInMissing: "LinkedIn-profil otillgänglig",
          checkedIn: "Du är incheckad",
          checkedInShort: "Incheckad!",
          options: "Eventalternativ",
          edit: "Redigera event",
          delete: "Radera event",
          deleteConfirmTitle: "Radera event",
          deleteConfirmDescription:
            "Denna åtgärd kan inte ångras. Vill du radera detta event?",
          deleteConfirmSubmit: "Radera",
          deleteConfirmCancel: "Avbryt",
        },
        attendButton: {
          checkingIn: "Checkar in...",
          checkInLinkedIn: "Checka in med LinkedIn",
          checkIn: "Checka in",
        },
        attendeeList: {
          singular: "Deltagare",
          plural: "Deltagare",
          loading: "Laddar deltagare...",
          organizerEmpty:
            "Inga deltagare än. Dela din kod för att komma igång.",
          attendeeEmpty: "Inga deltagare än. Bli den första att checka in.",
        },
        page: {
          loading: "Laddar event...",
          notFoundTitle: "Eventet hittades inte",
          notFoundDescription: "Detta event existerar inte.",
          homeButton: "Gå hem",
          guestNotice:
            "Genom att checka in godkänner du att dela din LinkedIn-profil med eventets deltagare.",
          signInPrompt: "Logga in",
          backToDashboard: "Tillbaka till översikt",
        },
        toast: {
          loadFailure: "Kunde inte ladda event",
          checkInSuccess: "Incheckningen lyckades",
          checkInFailure: "Incheckningen misslyckades",
          alreadyCheckedIn: "Redan incheckad",
          eventNotFound: "Eventet hittades inte",
          updateSuccess: "Eventet uppdaterades",
          updateFailure: "Kunde inte uppdatera event",
          deleteSuccess: "Eventet raderades",
          deleteFailure: "Kunde inte radera event",
        },
      },
      eventSuccess: {
        loading: "Laddar...",
        title: "Event skapat",
        description: "Dela koden eller QR-koden med deltagarna.",
        codeLabel: "Eventkod",
      },
      qrScanner: {
        title: "Skanna QR-kod",
        permissionDenied:
          "Kameraåtkomst nekad. Aktivera behörigheter i dina webbläsarinställningar.",
        instructions: "Placera QR-koden inom ramen",
      },
      qrCodeDialog: {
        title: "Event-QR-kod",
        description: "Deltagarna skannar denna kod för att checka in",
      },
      qrCodePreview: {
        alt: "QR-kod",
        generating: "Genererar kod...",
      },
      locationAutocomplete: {
        placeholder: "Sök efter en plats...",
      },
      notFound: {
        title: "404",
        subtitle: "Sidan hittades inte",
        link: "Tillbaka hem",
      },
      qrScannerErrors: {
        invalidQr: "Ogiltig QR-kod för event",
        invalidFormat: "Ogiltigt QR-kodformat",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
