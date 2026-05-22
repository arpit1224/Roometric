import { useEffect, useState } from "react";
import { useParams } from "react-router";

const Visualizer = () => {
  const { id } = useParams();
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const storageKey = `roometric-upload-${id}`;
    setBase64Image(sessionStorage.getItem(storageKey));
  }, [id]);

  return (
    <div className="visualizer-route">
      {base64Image ? (
        <img src={base64Image} alt="Uploaded floor plan" />
      ) : (
        <p>No uploaded floor plan found.</p>
      )}
    </div>
  )
}

export default Visualizer
