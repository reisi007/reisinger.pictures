export function Required({ required = false }: { required?: boolean }) {
  return required && <span class="text-error">*</span>;
}