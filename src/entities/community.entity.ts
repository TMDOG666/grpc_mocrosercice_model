import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('communities')
export class Community {
  @PrimaryColumn({ type: 'bigint', unique: true, name: 'community_id' })
  communityId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  communityName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  communityDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  communityCreator: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  communityTags: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  communityAddress: string;
}

@Entity('points')
export class Point {
  @PrimaryColumn({ type: 'bigint', unique: true, name: 'point_id' })
  pointId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pointName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pointAddress: string;
}

@Entity('points_communities_mid')
export class PointsCommunitiesMid {
  @PrimaryGeneratedColumn({ type: 'int', name: 'point_community_id' })
  pointCommunityId: number;

  @ManyToOne(() => Point, { nullable: true })
  @JoinColumn({ name: 'point_id' })
  point: Point;

  @ManyToOne(() => Community, { nullable: true })
  @JoinColumn({ name: 'community_id' })
  community: Community;
}
