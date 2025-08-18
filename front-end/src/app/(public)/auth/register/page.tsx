import RegisterForm from "./register-form";

export default function Page() {
  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Đăng ký khách hàng</h1>
      <RegisterForm />
    </div>
  );
}
