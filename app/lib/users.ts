import {prisma} from "@/prisma/prisma"
import bcrypt from "bcrypt";


export const getUserByEmail = async (email: string) => {
    try {
        return await prisma.user.findFirst({
            where: {
                email: email
            }
        });
    } catch (err) {
        console.log(err);
    }
    return null;
}

export const CreateNewUser = async (userData: any) => {
    const {email, password, fullname} = userData;
    await prisma.user.create({
        data: {
            email: email,
            password: await hashPassword(password),
            name: fullname,
        }
    })
}

export const hashPassword = async (password: string) => {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
}

export const compareHash = async (hash: string, password: string) => {
    return await bcrypt.compare(password, hash);
}
