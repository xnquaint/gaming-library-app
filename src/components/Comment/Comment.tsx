
import { Link } from 'react-router-dom';
import tempAvatar from '../../assets/avatar_placeholder.png';
import { CommentInterface } from '../../types/CommentInterface';

interface Props {
  comment: CommentInterface;
}

export const Comment: React.FC<Props> = ({ comment }) => {
  return (
    <div className='mb-3 mx-5 flex items-start border-2 rounded border-solid border-[#9F2B68]'>
      <div className='text-3xl flex flex-col px-1 py-1 gap-1'>
        <Link to={`/user/${comment.userId}`} className='flex gap-3 items-center'>
          <img className='w-10 h-10 rounded-full' src={comment.avatarURL || tempAvatar} alt="User profile" />
          {comment.nickname}
        </Link>
        <p className='break-all text-black font-bold'>
          {comment.commentText}
        </p>
      </div>
    </div>
  );
}