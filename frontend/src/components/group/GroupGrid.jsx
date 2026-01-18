import PropTypes from "prop-types";
import GroupCard from "@/components/group/GroupCard";
import MyGroupCard  from "@/components/group/MyGroupCard";

const GroupGrid = ({ groups, isMyGroups }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {groups.map((group) => (
      isMyGroups ? <MyGroupCard key={group._id} group={group} /> : <GroupCard key={group._id} group={group} />
    ))}
  </div>
);

GroupGrid.propTypes = {
  groups: PropTypes.array.isRequired,
  isMyGroups: PropTypes.bool.isRequired,
};


export default GroupGrid;