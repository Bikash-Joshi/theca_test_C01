// Static stand-in for auth: the "session" is just a profile kept in localStorage.
export type Profile = {
  email: string;
  name: string;
  address: string;
  phone: string;
};

const KEY = "maison-elan-profile";

export function getProfile(): Profile | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function setProfile(profile: Profile) {
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearProfile() {
  window.localStorage.removeItem(KEY);
}
