import { View } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
  templateId = "modern",
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
  templateId?: string;
}) => {
  const { name, email, phone, url, summary, location } = profile;
  const iconProps = { email, phone, location, url };

  const isClassic = templateId === "classic";
  const isMinimal = templateId === "minimal";

  return (
    <ResumePDFSection style={{
      marginTop: spacing["4"],
      alignItems: isClassic ? "center" : "flex-start"
    }}>
      <ResumePDFText
        bold={true}
        themeColor={themeColor}
        style={{ fontSize: isMinimal ? "18pt" : "20pt" }}
      >
        {name}
      </ResumePDFText>
      {summary && (
        <ResumePDFText style={{
          textAlign: isClassic ? "center" : "left",
          marginTop: spacing["1"]
        }}>
          {summary}
        </ResumePDFText>
      )}
      <View
        style={{
          ...styles.flexRow,
          justifyContent: isClassic ? "center" : "flex-start",
          flexWrap: "wrap",
          marginTop: spacing["1"],
          gap: spacing["3"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`; // Keep only + and digits
                break;
              }
              default: {
                // Security: Prevent javascript: URIs
                const sanitizedValue = value.trim().toLowerCase();
                if (sanitizedValue.startsWith("javascript:")) {
                  return <>{children}</>;
                }
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
              }}
            >
              {!isClassic && <ResumePDFIcon type={iconType} isPDF={isPDF} />}
              <Wrapper>
                <ResumePDFText>{value}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
