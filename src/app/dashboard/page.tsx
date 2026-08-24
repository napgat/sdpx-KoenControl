import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // ดึงข้อมูล Session จากฝั่ง Server
  const session = await auth();

  // ถ้าไม่มี session ให้เด้งกลับไปหน้าแรก (ถึงแม้จะมี middleware ดักไว้แล้วก็ตาม เป็นการดับเบิ้ลเช็ค)
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">ยินดีต้อนรับเข้าสู่ระบบ PairEval</p>
          </div>
          
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-lg border border-red-500/20 transition-all"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">ข้อมูลบัญชีของคุณ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-slate-500">ชื่อ</p>
                <p className="text-slate-200 font-medium">{session.user.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-slate-500">อีเมล</p>
                <p className="text-slate-200 font-medium">{session.user.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-slate-500">Role</p>
                <span className="inline-flex px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-xs font-mono">
                  {session.user.platformRole}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-slate-500">สร้าง Classroom ได้หรือไม่?</p>
                <p className="text-slate-200 font-medium">
                  {session.user.canCreateClassroom ? "✅ ได้" : "❌ ไม่ได้"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
