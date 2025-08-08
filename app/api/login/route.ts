import connectToDatabase from '../../../lib/mongodb'; // adjust path as needed
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectToDatabase(); // Ensure DB connection

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await User.findOne({ email }).exec();

        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // TODO: Add session or JWT token generation here for authentication

        return new Response(
            JSON.stringify({
                success: true,
                userId: user._id,
                role: user.role,
                email: user.email,
                name: user.name,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
