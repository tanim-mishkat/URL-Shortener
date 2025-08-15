import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api";
import { login } from "../store/slice/authSlice";

export const checkAuth = async ({ context }) => {
    try {
        const { store, queryClient } = context;

        const user = await queryClient.ensureQueryData({
            queryKey: ["currentUser"],
            queryFn: () => getCurrentUser(),
        });
        if (!user) return false;
        console.log(user)

        store.dispatch(login(user));
        const { isLoggedIn } = store.getState().auth;
        if (!isLoggedIn) return false;
        return true;
    }
    catch (err) {
        return redirect({ to: "/auth" });
    }

};
