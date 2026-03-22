// ... (existing Dashboard code)
const { user } = useAuth();
const [topupExpiry, setTopupExpiry] = useState<Date | null>(null);

useEffect(() => {
  if (user) {
    const expiry = user.topupExpiry?.toDate();
    setTopupExpiry(expiry);
  }
}, [user]);

const daysLeft = topupExpiry ? Math.ceil((topupExpiry - new Date()) / (1000 * 60 * 60 * 24)) : 0;

// ... (rest of Dashboard code)

{user?.plan === 'free' && user?.topupExports === 75 && (
  <p className="text-center text-green-500">
    You have 75 free credits! 🎉
  </p>
)}

{user?.plan === 'pro' && user?.topupExpiry && (
  daysLeft > 0 && daysLeft <= 7 ? (
    <Badge variant="destructive" className="ml-2">
      {daysLeft} days left to use your credits!
    </Badge>
  ) : null
)