export default function get_user(email: string, value: string): Promise<{
    id: number;
    username: string;
    email: string;
    password: string;
    photo: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
//# sourceMappingURL=get_user.d.ts.map