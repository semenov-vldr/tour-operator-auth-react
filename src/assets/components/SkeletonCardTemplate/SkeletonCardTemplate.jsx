import Skeleton from "@mui/material/Skeleton";
import "./SkeletonCardTemplate.sass";

export default function SkeletonCardTemplate () {
  return (
    <div className="skeleton-box">
      <div className="skeleton-header">
      <Skeleton
        animation="wave"
        height={56}
        width="40%"
        sx={{ bgcolor: '#a6b2ce5c' }}
      />
        <Skeleton
          animation="wave"
          variant="circular"
          height={26}
          width={26}
          sx={{ bgcolor: '#a6b2ce5c' }}
        />
      </div>
      <Skeleton
        animation="wave"
        height={40}
        width="50%"
        sx={{ bgcolor: '#a6b2ce5c' }}
        style={{ marginBottom: 16 }}
      />
      <Skeleton
        animation="wave"
        height={40}
        width="100%"
        sx={{ bgcolor: '#a6b2ce5c' }}
        style={{ marginBottom: 12 }}
      />
      <Skeleton
        animation="wave"
        height={40}
        width="100%"
        sx={{ bgcolor: '#a6b2ce5c' }}
        style={{ marginBottom: 16 }}
      />
    </div>
  )
}