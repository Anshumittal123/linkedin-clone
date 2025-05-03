import {
    FacebookShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    WhatsappIcon,
    EmailIcon,
  } from "react-share";
  import toast from "react-hot-toast";
  
  const ShareAction = ({ postId }) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareText = "Check out this post!";
  
    return (
      <div className="p-2 rounded shadow bg-white z-10 space-y-2">
        <div className="flex items-center gap-2">
          <WhatsappShareButton url={shareUrl} title={shareText}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <EmailShareButton url={shareUrl} subject="Interesting Post" body={shareText}>
            <EmailIcon size={32} round />
          </EmailShareButton>
          <FacebookShareButton url={shareUrl} quote={shareText}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
        <div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied to clipboard");
            }}
            className="text-sm mt-2 text-blue-600 hover:underline"
          >
            Copy Link
          </button>
        </div>
      </div>
    );
  };

  export default ShareAction