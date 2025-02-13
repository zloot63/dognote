import Layout from "@/app/components/layout/Layout";
import DogProfile from "@/app/components/dashboard/DogProfile";
import RecentSchedule from "@/app/components/dashboard/RecentSchedule";

export default function Dashboard() {
  return (
    <Layout>
      <DogProfile />
      <RecentSchedule />
    </Layout>
  )
}
