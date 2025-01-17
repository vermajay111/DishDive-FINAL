import Sidebar from "@/components/custom/sidebar/sidebar";

function Terms() {
  return (

   
      <Sidebar>
        <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-[35%] overflow-hidden">
        <div className="p-6 bg-white rounded-lg shadow-lg w-[90%] max-w-2xl">
          <h1 className="text-2xl font-semibold mb-4 text-center text-black">
            Important Information And Credits
          </h1>
          <p className="text-gray-700 text-base leading-relaxed">
            This website was created by Jay Verma (December 18, 2007) and is
            fully developed by him. The frontend is built using{" "}
            <strong>React.ts</strong>, while the backend utilizes
            <strong> Django Rest Framework</strong> powered by Python. The UI
            kit used to create this application is called
            <strong> Shadcn</strong>, and the AI model was trained using{" "}
            <strong>Unsloth AI</strong>. The LLM implemented for this app is{" "}
            <strong>LLAMA3-7b</strong> by Meta. The dataset was acquired from
            Kaggle, containing approximately
            <strong> 1.5 million instances</strong>. The image generation model
            employed is
            <strong> Stable Diffusion</strong> from Hugging Face. The images of
            various foods displayed on the site are also AI-generated by{" "}
            <strong>Stable Diffusion</strong>. This app was created in{" "}
            <strong>October 2024</strong>.
          </p>
        </div>
        </div>
        </div>
        
      </Sidebar>
   
  );
}

export default Terms;
