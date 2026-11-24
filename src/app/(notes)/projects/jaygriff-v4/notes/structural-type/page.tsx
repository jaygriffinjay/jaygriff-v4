// goatboat: 7433d653-9922-4952-b68d-ddd9b04d61ef
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { StructuralTypePreview } from "./StructuralTypePreview";
import styles from "./page.module.css";

export default function StructuralTypePage() {
  return (
    <PageLayout>
      <PageHeader intro="Compare Google Fonts and Inter variable axes across the real site header, tagline, navigation, and footer." />
      <StructuralTypePreview className={styles.preview} />
    </PageLayout>
  );
}