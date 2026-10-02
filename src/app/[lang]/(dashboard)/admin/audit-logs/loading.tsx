import AuditLogTableLoading from "@/components/modules/audit-logs/audit-log-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <AuditLogTableLoading />
    </PageSkeleton>
  );
}
