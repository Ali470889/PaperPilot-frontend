// app/not-found.tsx (or wherever you place your NotFound page in your Next.js project)

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";


export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Page Not Found
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4">
                        Sorry, the page you are looking for does not exist or has been moved.
                    </p>
                    <Button asChild>
                        <Link to="/">Go back home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}