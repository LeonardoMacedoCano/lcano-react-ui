export interface BreadcrumbItem {
    label: string;
    path?: string;
}
export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    LinkComponent?: React.ElementType | null;
}
declare const Breadcrumb: React.FC<BreadcrumbProps>;
export default Breadcrumb;
//# sourceMappingURL=Breadcrumb.d.ts.map