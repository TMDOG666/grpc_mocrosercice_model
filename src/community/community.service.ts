import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community, Point, PointsCommunitiesMid } from '../entities/community.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    
    @InjectRepository(PointsCommunitiesMid)
    private readonly pointsCommunitiesMidRepository: Repository<PointsCommunitiesMid>,
  ) {}

  // Community CRUD
  async createCommunity(community: Community): Promise<Community> {
    try {
      return await this.communityRepository.save(community);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create community', error.message);
    }
  }

  async findAllCommunities(): Promise<Community[]> {
    try {
      return await this.communityRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve communities', error.message);
    }
  }

  async findOneCommunity(id: string): Promise<Community> {
    const community = await this.communityRepository.findOne({ where: { communityId: id } });
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    return community;
  }

  async findOneCommunityByName(name: string): Promise<Community> {
    const community = await this.communityRepository.findOne({ where: { communityName: name } });
    return community;
  }


  async updateCommunity(id: string, community: Partial<Community>): Promise<Community> {
    const existingCommunity = await this.findOneCommunity(id);
    try {
      await this.communityRepository.update(existingCommunity.communityId, community);
      return { ...existingCommunity, ...community };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update community', error.message);
    }
  }

  async removeCommunity(id: string): Promise<void> {
    const community = await this.findOneCommunity(id);
    try {
      await this.communityRepository.delete(community.communityId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete community', error.message);
    }
  }

  // Point CRUD
  async createPoint(point: Point): Promise<Point> {
    try {
      return await this.pointRepository.save(point);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create point', error.message);
    }
  }

  async findAllPoints(): Promise<Point[]> {
    try {
      return await this.pointRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve points', error.message);
    }
  }

  async findOnePoint(id: string): Promise<Point> {
    const point = await this.pointRepository.findOne({ where: { pointId: id } });
    if (!point) {
      throw new NotFoundException(`Point with ID ${id} not found`);
    }
    return point;
  }

  async updatePoint(id: string, point: Partial<Point>): Promise<Point> {
    const existingPoint = await this.findOnePoint(id);
    try {
      await this.pointRepository.update(existingPoint.pointId, point);
      return { ...existingPoint, ...point };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update point', error.message);
    }
  }

  async removePoint(id: string): Promise<void> {
    const point = await this.findOnePoint(id);
    try {
      await this.pointRepository.delete(point.pointId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete point', error.message);
    }
  }

  // PointsCommunitiesMid CRUD
  async createPointsCommunitiesMid(data: PointsCommunitiesMid): Promise<PointsCommunitiesMid> {
    try {
      return await this.pointsCommunitiesMidRepository.save(data);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create points-communities relation', error.message);
    }
  }

  async findAllPointsCommunitiesMid(): Promise<PointsCommunitiesMid[]> {
    try {
      return await this.pointsCommunitiesMidRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve points-communities relations', error.message);
    }
  }

  async findOnePointsCommunitiesMid(id: number): Promise<PointsCommunitiesMid> {
    const relation = await this.pointsCommunitiesMidRepository.findOne({ where: { pointCommunityId: id } });
    if (!relation) {
      throw new NotFoundException(`Relation with ID ${id} not found`);
    }
    return relation;
  }


  async updatePointsCommunitiesMid(id: number, data: Partial<PointsCommunitiesMid>): Promise<PointsCommunitiesMid> {
    const existingRelation = await this.findOnePointsCommunitiesMid(id);
    try {
      await this.pointsCommunitiesMidRepository.update(existingRelation.pointCommunityId, data);
      return { ...existingRelation, ...data };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update points-communities relation', error.message);
    }
  }

  async removePointsCommunitiesMid(id: number): Promise<void> {
    const relation = await this.findOnePointsCommunitiesMid(id);
    try {
      await this.pointsCommunitiesMidRepository.delete(relation.pointCommunityId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete points-communities relation', error.message);
    }
  }
}
