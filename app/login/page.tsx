import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md gap-6">
        <CardHeader className="gap-2 text-center">
          <CardTitle className="font-heading text-2xl font-semibold">
            Entrar
          </CardTitle>
          <CardDescription>
            O login e os níveis de acesso (Admin, Staff e Visitante) serão
            habilitados em breve via Supabase. Cada nível poderá gerenciar foto
            de perfil, senha e — no caso do Admin — os acessos de toda a equipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@empresa.com"
                autoComplete="email"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled
              />
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled>
              Entrar
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Autenticação em breve.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
