import { RxCross2 } from "react-icons/rx";

interface ProfileProps {
  user: Object;
  onClose: () => void;
}

const ProfilePreview: React.FC<ProfileProps> = ({ user, onClose }) => {
  return (
    <div className="relative mt-7 px-9 flex flex-col justify-between w-full min-w-fit bg-white dark:bg-black rounded-t-[2rem]">
      <button
        onClick={onClose}
        className="absolute top-14 right-14 text-[3rem]"
      >
        <RxCross2 />
      </button>
      <div>
        <div className="px-20 pt-16 pb-7 flex flex-col gap-7 items-center">
          <img
            className="h-24 aspect-square rounded-full"
            src={user.avatar.url}
            alt={user.username}
          />
          <h4 className="text-black dark:text-white font-medium text-[1.4rem]">
            {user.username}
          </h4>
          <span className="flex gap-2">
            <p className="text-black dark:text-white text-[1rem]">Bio :</p>
            <p className="text-[1rem] text-gray-500 dark:text-gray-400">
              {user.bio}
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
