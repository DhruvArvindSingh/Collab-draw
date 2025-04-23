export default function insert_user(username: string, email: string, password: string): Promise<{
    id: number;
    username: string;
    email: string;
    password: string;
    photo: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=insert_user.d.ts.map