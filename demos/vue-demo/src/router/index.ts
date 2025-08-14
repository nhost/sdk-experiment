import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../lib/nhost/auth'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import Profile from '../views/Profile.vue'
import Verify from '../views/Verify.vue'

// Simple Home component
const Home = {
  template: `
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>
      <div class="glass-card w-full p-8 mb-6">
        <h2 class="text-2xl mb-4">Welcome to Nhost Vue Demo</h2>
        <p class="mb-4">This is a demonstration of the Nhost SDK with Vue.js.</p>
        <div class="space-y-4">
          <router-link to="/signin" class="btn btn-primary w-full block text-center">Sign In</router-link>
          <router-link to="/signup" class="btn btn-secondary w-full block text-center">Sign Up</router-link>
        </div>
      </div>
    </div>
  `,
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/verify',
      name: 'Verify',
      component: Verify,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Navigation guard for protected routes
router.beforeEach((to) => {
  if (to.meta['requiresAuth']) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated.value) {
      return '/signin'
    }
  }
  return true
})

export default router
