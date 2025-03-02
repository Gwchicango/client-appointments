import { AuthProvider } from "@/app/(context)/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  );
}